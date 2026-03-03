import type { Dispatch, SetStateAction } from "react";
import type { ControlValue, GovernorState } from "../../page/Content/types";
import type { SolutionData } from "../Governor/types";

export type ModalControlProps = {
    controlValue: ControlValue;
    tData: number[];
    solution: SolutionData;
    setPlay: Dispatch<SetStateAction<boolean>>;
    setAParams: Dispatch<SetStateAction<number>>;
    setF0Params: Dispatch<SetStateAction<number>>;
    setMParams: Dispatch<SetStateAction<number>>;
    aParams: number;
    f0Params: number;
    mParams: number;
    initialConditions: GovernorState;
    setInitialConditins: Dispatch<SetStateAction<GovernorState>>;
    play: boolean;
    setType: Dispatch<SetStateAction<boolean>>;
    type: boolean;
};
