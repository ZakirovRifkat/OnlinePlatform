import type { Dispatch, SetStateAction } from "react";
import type { ControlValue } from "../../page/Content/types";

export type ControlPanelProps = {
    setControl: Dispatch<SetStateAction<ControlValue>>;
    controlValue: ControlValue;
    isOrbit: boolean;
    setOrbit: Dispatch<SetStateAction<boolean>>;
    setPlay: Dispatch<SetStateAction<boolean>>;
    play: boolean;
};
