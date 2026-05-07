import type { Dispatch, SetStateAction } from "react";
import type { Texture } from "three";
import type { LeverRightPosition } from "../Lever/types";

export type SolutionData = number[][];

export type BaseMapsProps = {
    colorMap: Texture;
    displacementMap: Texture;
    normalMap: Texture;
    roughnessMap: Texture;
};

export type GovernorProps = BaseMapsProps & {
    isModelLoaded: boolean;
    setModelLoaded: Dispatch<SetStateAction<boolean>>;
    play: boolean;
    type: boolean;
    solution: SolutionData;
    onRotorSpeedFactorChange?: (value: number) => void;
    onSleeveProgressChange?: (progress: number) => void;
    servoTripleSignal?: number;
    leverRightPosition?: LeverRightPosition;
    lever2Position?: LeverRightPosition;
};
