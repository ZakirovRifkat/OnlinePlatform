import type { Group, Object3D, Scene } from "three";

export type Vec3 = [number, number, number];
export type AxisName = "x" | "y" | "z";

export interface LeverRightPosition {
    x: number;
    y: number;
    yDisplacement: number;
}

export interface ServoMotorTexturePaths {
    color?: string;
    normal?: string;
    roughness?: string;
    metalness?: string;
    ao?: string;
}

export interface ServoMotorModelUrls {
    body: string;
    triple: string;
    single: string;
    rivet?: string;
}

export interface ServoMotorChildOffsets {
    triple?: Vec3;
    single?: Vec3;
}

export interface ServoMotorMotionOptions {
    spoolAxis?: AxisName;
    chamberAxis?: AxisName;
    tripleTravel?: number;
    singleTravel?: number;
}

export interface ServoMotorOptions {
    scene: Scene;
    parent?: Object3D;
    position?: Vec3;
    rotationDeg?: Vec3;
    scale?: number | Vec3;
    texturePaths?: ServoMotorTexturePaths;
    modelUrls?: Partial<ServoMotorModelUrls>;
    childOffsets?: ServoMotorChildOffsets;
    motion?: ServoMotorMotionOptions;
}

export interface ServoMotorHandles {
    root: Group;
    body: Object3D;
    triple: Object3D;
    single: Object3D;
    rivet: Object3D;
}
