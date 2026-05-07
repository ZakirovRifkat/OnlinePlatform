import type { Object3D } from "three";

export type Vec3 = [number, number, number];
export type AxisName = "x" | "y" | "z";

export interface MetalTexturePaths {
    color: string;
    normal: string;
    roughness: string;
    metalness: string;
    displacement: string;
}

export interface SceneLoadOptions {
    rotationSpeedFactor?: number;
    globalScale?: number | Vec3;
    texturePaths?: Partial<MetalTexturePaths>;
}

export interface TransformConfig {
    position?: Vec3;
    rotation?: Vec3;
    scale?: Vec3;
}

export interface GroupConfig extends TransformConfig {
    id: string;
    parentGroupId?: string;
}

export interface ModelConfig extends TransformConfig {
    id: string;
    url: string;
    parentId?: string;
    groupId?: string;
    dependsOn?: string[];
}

export interface SceneBlueprint {
    groups: GroupConfig[];
    models: ModelConfig[];
    engineAnimation?: EngineAnimationConfig;
    debugMarkers?: DebugMarkerConfig;
}

export interface DebugMarkerConfig {
    modelIds: string[];
    size?: number;
    color?: number;
}

export interface EngineAnimationConfig {
    enabled?: boolean;
    mode?: "auto" | "manual";
    crankId: string;
    conrodId: string;
    pistonId: string;
    rpm?: number;
    crankAngleDeg?: number;
    phaseOffsetDeg?: number;
    crankRotationAxis?: AxisName;
    travelAxis?: AxisName;
    conrodTiltAxis?: AxisName;
    conrodPhaseOffsetDeg?: number;
    conrodHorizontalRange?: number;
    pistonHorizontalRange?: number;
    conrodTiltRangeDeg?: number;
    conrodTiltMinDeg?: number;
    conrodTiltMaxDeg?: number;
    conrodTiltDirection?: 1 | -1;
}

export interface LoadedNode {
    id: string;
    object: Object3D;
    sourceUrl: string;
    isFallback: boolean;
}
