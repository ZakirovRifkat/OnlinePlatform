import type { Dispatch, SetStateAction } from "react";
import type { GovernorState } from "../../../../page/Content/types";

export type ParametersPanelProps = {
    setPlay: Dispatch<SetStateAction<boolean>>;
    setAParams: Dispatch<SetStateAction<number>>;
    setF0Params: Dispatch<SetStateAction<number>>;
    setMParams: Dispatch<SetStateAction<number>>;
    aParams: number;
    f0Params: number;
    mParams: number;
    initialConditions: GovernorState;
    setInitialConditins: Dispatch<SetStateAction<GovernorState>>;
    type: boolean;
    setType: Dispatch<SetStateAction<boolean>>;
};
