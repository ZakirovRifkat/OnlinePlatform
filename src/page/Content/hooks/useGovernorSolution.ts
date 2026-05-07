import { useEffect, useState } from "react";
import { fetchClassicModelData } from "../../../api/modelApi";
import type { SolutionData } from "../../../components/Governor/types";
import type { GovernorState, SystemParams } from "../types";

type UseGovernorSolutionArgs = {
    initialConditions: GovernorState;
    tSpan: number[];
    dt: number;
    aParams: number;
    f0Params: number;
    mParams: number;
    systemParams: SystemParams;
};

type ClassicSolutionResult = {
    solution: SolutionData;
    tData: number[];
    loading: boolean;
    error: unknown;
    refetch: () => void;
};

const REQUEST_DEBOUNCE_MS = 250;

export const useGovernorSolution = ({
    initialConditions,
    tSpan,
    dt,
    aParams,
    f0Params,
    mParams,
    systemParams,
}: UseGovernorSolutionArgs) => {
    const { b, J, beta, r, gamma0, x0 } = systemParams;
    const [requestVersion, setRequestVersion] = useState(0);
    const [result, setResult] = useState<ClassicSolutionResult>({
        solution: [],
        tData: tSpan,
        loading: true,
        error: undefined,
        refetch: () => setRequestVersion((prev) => prev + 1),
    });

    useEffect(() => {
        let isActive = true;
        const controller = new AbortController();

        setResult((prev) => ({
            ...prev,
            loading: true,
            error: undefined,
        }));

        const timeoutId = window.setTimeout(() => {
            fetchClassicModelData(
                {
                    a: aParams,
                    b,
                    F0: f0Params,
                    m: mParams,
                    J,
                    beta,
                    r,
                    gamma0,
                    x0,
                    dt,
                    tEnd: tSpan[tSpan.length - 1],
                    initial: initialConditions,
                },
                controller.signal,
            )
                .then((response) => {
                    if (isActive) {
                        setResult((prev) => ({
                            ...prev,
                            solution: response.y,
                            tData: response.t,
                            loading: false,
                            error: undefined,
                        }));
                    }
                })
                .catch((error: unknown) => {
                    if (
                        !isActive ||
                        (typeof error === "object" &&
                            error !== null &&
                            "code" in error &&
                            error.code === "ERR_CANCELED")
                    ) {
                        return;
                    }

                    console.error("Classic model request failed", error);
                    setResult((prev) => ({
                        ...prev,
                        solution: [],
                        tData: tSpan,
                        loading: false,
                        error,
                    }));
                });
        }, REQUEST_DEBOUNCE_MS);

        return () => {
            isActive = false;
            clearTimeout(timeoutId);
            controller.abort();
        };
    }, [
        aParams,
        b,
        beta,
        dt,
        f0Params,
        gamma0,
        initialConditions,
        J,
        mParams,
        requestVersion,
        r,
        tSpan,
        x0,
    ]);

    return result;
};
