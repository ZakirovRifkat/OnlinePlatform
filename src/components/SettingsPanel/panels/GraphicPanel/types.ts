import type { SolutionData } from "../../../Governor/types";
import type { ServoChartTrace } from "../../charts/ServoModelChart/types";

export type GraphicPanelProps = {
    tData: number[];
    solution: SolutionData;
    classicLoading: boolean;
    classicError: unknown;
    onRetryClassic: () => void;
    servoData?: ServoChartTrace;
    servoData2?: ServoChartTrace;
    servoLoading: boolean;
    servoError: unknown;
    servoTimeData: number[];
    onRetryServo: () => void;
};
