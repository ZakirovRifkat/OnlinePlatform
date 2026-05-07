import type { ModelRequestParams } from "../../../../api/types";

export type ServoChartTrace = {
    x: number[];
    y: number[];
    mode: "lines";
    showlegend: boolean;
    name: string;
};

export type ServoModelChartProps = {
    data?: ServoChartTrace;
    data2?: ServoChartTrace;
    loading: boolean;
    error: unknown;
    timeData: number[];
    onRetry: () => void;
};

export type UseServoModelDataParams = {
    getRequestParams: () => ModelRequestParams;
    setServoSeries: (
        xValues: number[],
        yValues: number[],
        zValues: number[],
    ) => void;
};
