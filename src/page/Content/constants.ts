import type { GovernorState, SystemParams } from "./types";

export const DEFAULT_CONTROL_VALUE = "params" as const;

export const INITIAL_CONDITIONS: GovernorState = [1.0, 0.0, 1.0];

export const SYSTEM_PARAMS: SystemParams = {
    b: 0.2,
    J: 1.0,
    beta: 0.5,
    r: 0.1,
    gamma0: 0.2,
    x0: 0.1,
};

export const T_SPAN_LENGTH = 10000;
export const T_SPAN_DIVIDER = 100;

export const CONTENT_TRANSITION = { duration: 1 };

export const FOOTER_DEPARTMENT =
    "СПБГУ. Математико-механический факультет. Кафедра прикладной кибернетики.";

export const FOOTER_AUTHOR = "Закиров Р.Э";
