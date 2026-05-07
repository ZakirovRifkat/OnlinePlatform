import { useCallback, useEffect, useState } from "react";
import { fetchModelData } from "../../../../../api/modelApi";
import type { ServoChartTrace, UseServoModelDataParams } from "../types";

const REQUEST_DEBOUNCE_MS = 250;

export const useServoModelData = ({
    getRequestParams,
    setServoSeries,
}: UseServoModelDataParams) => {
    const [data, setData] = useState<ServoChartTrace>();
    const [data2, setData2] = useState<ServoChartTrace>();
    const [loading, setLoading] = useState(true);
    const [timeData, setTimeData] = useState<number[]>([]);
    const [error, setError] = useState<unknown>();
    const [requestVersion, setRequestVersion] = useState(0);

    const refetch = useCallback(() => {
        setRequestVersion((prev) => prev + 1);
    }, []);

    useEffect(() => {
        let isActive = true;
        const controller = new AbortController();

        setLoading(true);
        setError(undefined);

        const timeoutId = window.setTimeout(() => {
            fetchModelData(getRequestParams(), controller.signal)
                .then((response) => {
                    if (!isActive) {
                        return;
                    }

                    // y[:, 2]
                    const xValues = response.y.map((row: number[]) => row[2]);

                    // y[:, 3]
                    const yValues = response.y.map((row: number[]) => row[3]);

                    // y[:, 0]
                    const zValues = response.y.map((row: number[]) => row[0]);

                    setServoSeries(xValues, yValues, zValues);
                    setTimeData(response.t);
                    setData({
                        x: response.t,
                        y: zValues,
                        mode: "lines",
                        showlegend: false,
                        name: "Смещение ползунка",
                    });
                    setData2({
                        x: response.t,
                        y: yValues,
                        mode: "lines",
                        showlegend: false,
                        name: "Изменение угловой скорости",
                    });
                    setLoading(false);
                })
                .catch((requestError: unknown) => {
                    if (
                        !isActive ||
                        (typeof requestError === "object" &&
                            requestError !== null &&
                            "code" in requestError &&
                            requestError.code === "ERR_CANCELED")
                    ) {
                        return;
                    }

                    console.error("Ошибка:", requestError);
                    setError(requestError);
                    setLoading(false);
                });
        }, REQUEST_DEBOUNCE_MS);

        return () => {
            isActive = false;
            clearTimeout(timeoutId);
            controller.abort();
        };
    }, [getRequestParams, requestVersion, setServoSeries]);

    return {
        data,
        data2,
        error,
        loading,
        refetch,
        timeData,
    };
};
