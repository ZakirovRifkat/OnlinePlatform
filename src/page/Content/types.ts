import type { Dispatch, SetStateAction } from "react";
import type { Texture } from "three";

export type GovernorState = [number, number, number];

export type ControlValue = "info" | "params" | "graphic" | null;

export type SystemParams = {
    b: number;
    J: number;
    beta: number;
    r: number;
    gamma0: number;
    x0: number;
};

export type ContentProps = {
    colorMap: Texture;
    displacementMap: Texture;
    normalMap: Texture;
    roughnessMap: Texture;
    isModelLoaded: boolean;
    setModelLoaded: Dispatch<SetStateAction<boolean>>;
};
