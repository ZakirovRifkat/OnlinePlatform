import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Group } from "three";
import { LeverAssembly } from "./LeverAssembly";
import { leverSceneBlueprint } from "./blueprint";
import type { LeverRightPosition, SceneHost } from "./types";
import { metalTextureName } from "../Governor/helpers";
import { METAL_TEXTURE_TYPES } from "../Governor/constants";

export interface LeverAssemblyInSceneProps {
    sleeveProgress: number;
    onLeverRightPositionChange?: (position: LeverRightPosition) => void;
    sceneTransform?: {
        position?: [number, number, number];
        rotationDeg?: [number, number, number];
        scale?: number;
    };
}

export const LeverAssemblyInScene = ({
    sleeveProgress,
    onLeverRightPositionChange,
    sceneTransform,
}: LeverAssemblyInSceneProps) => {
    const scene = useThree((state) => state.scene);
    const hostRootRef = useRef(new Group());
    const frameCallbacksRef = useRef<Set<(elapsedSec: number) => void>>(
        new Set(),
    );

    useEffect(() => {
        const hostRoot = hostRootRef.current;
        hostRoot.name = "lever-host";
        scene.add(hostRoot);

        return () => {
            scene.remove(hostRoot);
        };
    }, [scene]);

    const registerFrame = useCallback(
        (callback: (elapsedSec: number) => void) => {
            frameCallbacksRef.current.add(callback);

            return () => {
                frameCallbacksRef.current.delete(callback);
            };
        },
        [],
    );

    useFrame((state) => {
        const elapsedSec = state.clock.getElapsedTime();
        frameCallbacksRef.current.forEach((callback) => callback(elapsedSec));
    });

    const host = useMemo<SceneHost>(
        () => ({
            root: hostRootRef.current,
            registerFrame,
        }),
        [registerFrame],
    );

    const { lever } = leverSceneBlueprint;

    const leverTexturePaths = useMemo(
        () => ({
            colorMapUrl: metalTextureName(METAL_TEXTURE_TYPES[0]),
            normalMapUrl: metalTextureName(METAL_TEXTURE_TYPES[2]),
            roughnessMapUrl: metalTextureName(METAL_TEXTURE_TYPES[3]),
            metalnessMapUrl: metalTextureName(METAL_TEXTURE_TYPES[4]),
        }),
        [],
    );

    const sleeveProgressRef = useRef(sleeveProgress);
    sleeveProgressRef.current = sleeveProgress;

    const finalSceneTransform = useMemo(
        () => ({
            position: (sceneTransform?.position ?? [8.3, -5.1, 0]) as [
                number,
                number,
                number,
            ],
            rotationDeg: (sceneTransform?.rotationDeg ?? [0, 90, 0]) as [
                number,
                number,
                number,
            ],
            scale: sceneTransform?.scale ?? 1,
        }),
        [sceneTransform],
    );

    const resolveAngle = useCallback(() => {
        const rangeRad = lever.rangeRad ?? 1;
        const min = lever.minAngleRad ?? -rangeRad;
        const max = lever.maxAngleRad ?? rangeRad;
        // Map sleeveProgress: 0 = min, 1 = max
        return min + (max - min) * sleeveProgressRef.current;
    }, [lever.minAngleRad, lever.maxAngleRad, lever.rangeRad]);

    return (
        <LeverAssembly
            host={host}
            leverUrl="/models/lever.gltf"
            leverRightUrl="/models/lever_right_short.gltf"
            resolveAngle={resolveAngle}
            pivotAxis={lever.pivotAxis}
            leverRightScale={[1, 1.02, 1]}
            leverLeftScale={[1, 1.02, 1]}
            sceneTransform={finalSceneTransform}
            textures={leverTexturePaths}
            sleeveProgress={sleeveProgress}
            onLeverRightPositionChange={onLeverRightPositionChange}
        />
    );
};
