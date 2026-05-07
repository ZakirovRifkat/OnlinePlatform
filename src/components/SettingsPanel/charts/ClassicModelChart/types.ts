import type { SolutionData } from "../../../Governor/types";

export type ClassicModelChartProps = {
    tSpan: number[];
    solution: SolutionData;
    play: boolean;
    playStartedAt: number | null;
    loading: boolean;
    error: unknown;
    onRetry: () => void;
};
