import type { Group } from "three";

export type Vec3 = [number, number, number];
export type AxisName = "x" | "y" | "z";
export type BoundEdge = "min" | "max" | "center";
export type BoundAnchorValue = BoundEdge | number;

export interface LeverRightPosition {
    x: number;
    y: number;
    yDisplacement: number;
}

export interface SceneHost {
    root: Group;
    registerFrame: (callback: (elapsedSec: number) => void) => () => void;
}

export interface TransformBlueprint {
    position?: Vec3;
    rotationDeg?: Vec3;
    scale?: number | Vec3;
}

export interface BoundAnchor {
    x: BoundAnchorValue;
    y: BoundAnchorValue;
    z: BoundAnchorValue;
}

export interface AttachmentBlueprint {
    parentId: string;
    parentAnchor: BoundAnchor;
    selfAnchor: BoundAnchor;
    offset?: Vec3;
    tiltFactor?: number;
}

export interface ModelBlueprint extends TransformBlueprint {
    id: string;
    url: string;
    pivotMode?: "none" | "bounds-center";
    showOrigin?: boolean;
    attachment?: AttachmentBlueprint;
    /** Simple parenting: model becomes a child of the specified parent at its local origin. */
    parentId?: string;
}

export interface LeverMechanismBlueprint {
    enabled: boolean;
    leverId: string;
    leftId: string;
    rightId: string;
    pivotAxis: AxisName;
    speed: number;
    rangeRad?: number;
    minAngleRad?: number;
    maxAngleRad?: number;
    showPivot: boolean;
}

export interface SceneBlueprint {
    models: ModelBlueprint[];
    lever: LeverMechanismBlueprint;
}
