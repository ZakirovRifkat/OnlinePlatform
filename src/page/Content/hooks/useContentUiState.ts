import { useState } from "react";
import { DEFAULT_CONTROL_VALUE } from "../constants";
import type { ControlValue } from "../types";

export const useContentUiState = () => {
    const [isPlay, setIsPlay] = useState(false);
    const [controlValue, setControl] = useState<ControlValue>(
        DEFAULT_CONTROL_VALUE,
    );
    const [isOrbit, setOrbit] = useState(false);
    const [type, setType] = useState(false);

    return {
        isPlay,
        setIsPlay,
        controlValue,
        setControl,
        isOrbit,
        setOrbit,
        type,
        setType,
    };
};
