import { useMemo } from "react";
import { solveGovernor } from "../helpers";
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

    return useMemo(
        () =>
            solveGovernor({
                initialConditions,
                tSpan,
                dt,
                params: {
                    a: aParams,
                    b,
                    F0: f0Params,
                    m: mParams,
                    J,
                    beta,
                    r,
                    gamma0,
                    x0,
                },
            }),
        [
            aParams,
            b,
            beta,
            dt,
            f0Params,
            gamma0,
            initialConditions,
            J,
            mParams,
            r,
            tSpan,
            x0,
        ],
    );
};
