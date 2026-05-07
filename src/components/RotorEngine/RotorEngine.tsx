import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { sceneBlueprint } from "./blueprint";
import { SceneManager, type SceneManagerState } from "./sceneManager";
import type {
    MetalTexturePaths,
    SceneBlueprint,
    SceneLoadOptions,
    Vec3,
} from "./types";

export interface RotorEngineProps {
    blueprint?: SceneBlueprint;
    rotationSpeedFactor?: number;
    scale?: number | Vec3;
    texturePaths?: Partial<MetalTexturePaths>;
    className?: string;
    onStateChange?: (state: SceneManagerState) => void;
    onLoadingChange?: (loading: boolean) => void;
}

export interface RotorEngineInSceneProps {
    blueprint?: SceneBlueprint;
    rotationSpeedFactor?: number;
    scale?: number | Vec3;
    texturePaths?: Partial<MetalTexturePaths>;
    onStateChange?: (state: SceneManagerState) => void;
    onLoadingChange?: (loading: boolean) => void;
}

export const RotorEngine = ({
    blueprint = sceneBlueprint,
    rotationSpeedFactor = 0,
    scale = 1,
    texturePaths,
    className,
    onStateChange,
    onLoadingChange,
}: RotorEngineProps) => {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const managerRef = useRef<SceneManager | null>(null);
    const [localLoading, setLocalLoading] = useState(false);

    const scaleKey = useMemo(
        () => (Array.isArray(scale) ? scale.join(",") : String(scale)),
        [scale],
    );

    const texturePathsKey = useMemo(
        () => JSON.stringify(texturePaths ?? {}),
        [texturePaths],
    );

    const sceneLoadOptions = useMemo<SceneLoadOptions>(
        () => ({
            globalScale: scale,
            texturePaths,
        }),
        [scale, texturePaths],
    );

    useEffect(() => {
        if (!mountRef.current) {
            return;
        }

        const manager = new SceneManager(mountRef.current);
        managerRef.current = manager;

        return () => {
            manager.dispose();
            managerRef.current = null;
        };
    }, []);

    const onStateChangeRef = useRef(onStateChange);
    const onLoadingChangeRef = useRef(onLoadingChange);

    useEffect(() => {
        onStateChangeRef.current = onStateChange;
    }, [onStateChange]);

    useEffect(() => {
        onLoadingChangeRef.current = onLoadingChange;
    }, [onLoadingChange]);

    useEffect(() => {
        const manager = managerRef.current;
        if (!manager) {
            return;
        }

        manager.setRotationSpeedFactor(rotationSpeedFactor);
    }, [rotationSpeedFactor]);

    useEffect(() => {
        const manager = managerRef.current;
        if (!manager) {
            return;
        }

        let disposed = false;

        const load = async () => {
            setLocalLoading(true);
            onLoadingChangeRef.current?.(true);

            try {
                const state = await manager.loadBlueprint(
                    blueprint,
                    sceneLoadOptions,
                );
                if (!disposed) {
                    onStateChangeRef.current?.(state);
                }
            } catch (error) {
                if (!disposed) {
                    const message =
                        error instanceof Error
                            ? error.message
                            : "Unknown scene loading error";
                    onStateChangeRef.current?.({
                        loadedNodes: [],
                        warnings: [`Scene initialization failed: ${message}`],
                    });
                }
            } finally {
                if (!disposed) {
                    setLocalLoading(false);
                    onLoadingChangeRef.current?.(false);
                }
            }
        };

        void load();

        return () => {
            disposed = true;
        };
    }, [blueprint, sceneLoadOptions, scaleKey, texturePathsKey]);

    return (
        <div
            ref={mountRef}
            className={className}
            data-loading={localLoading ? "true" : "false"}
        />
    );
};

export const RotorEngineInScene = ({
    blueprint = sceneBlueprint,
    rotationSpeedFactor = 0,
    scale = 1,
    texturePaths,
    onStateChange,
    onLoadingChange,
}: RotorEngineInSceneProps) => {
    const scene = useThree((state) => state.scene);
    const managerRef = useRef<SceneManager | null>(null);
    const onStateChangeRef = useRef(onStateChange);
    const onLoadingChangeRef = useRef(onLoadingChange);

    const scaleKey = useMemo(
        () => (Array.isArray(scale) ? scale.join(",") : String(scale)),
        [scale],
    );

    const texturePathsKey = useMemo(
        () => JSON.stringify(texturePaths ?? {}),
        [texturePaths],
    );

    const sceneLoadOptions = useMemo<SceneLoadOptions>(
        () => ({
            globalScale: scale,
            texturePaths,
        }),
        [scale, texturePaths],
    );

    useEffect(() => {
        onStateChangeRef.current = onStateChange;
    }, [onStateChange]);

    useEffect(() => {
        onLoadingChangeRef.current = onLoadingChange;
    }, [onLoadingChange]);

    useEffect(() => {
        const manager = new SceneManager({
            externalScene: scene,
            autoFrame: false,
            includeDefaultEnvironment: false,
        });
        managerRef.current = manager;

        return () => {
            manager.dispose();
            managerRef.current = null;
        };
    }, [scene]);

    useEffect(() => {
        const manager = managerRef.current;
        if (!manager) {
            return;
        }

        manager.setRotationSpeedFactor(rotationSpeedFactor);
    }, [rotationSpeedFactor]);

    useEffect(() => {
        const manager = managerRef.current;
        if (!manager) {
            return;
        }

        let disposed = false;

        const load = async () => {
            onLoadingChangeRef.current?.(true);

            try {
                const state = await manager.loadBlueprint(
                    blueprint,
                    sceneLoadOptions,
                );
                if (!disposed) {
                    onStateChangeRef.current?.(state);
                }
            } catch (error) {
                if (!disposed) {
                    const message =
                        error instanceof Error
                            ? error.message
                            : "Unknown scene loading error";
                    onStateChangeRef.current?.({
                        loadedNodes: [],
                        warnings: [`Scene initialization failed: ${message}`],
                    });
                }
            } finally {
                if (!disposed) {
                    onLoadingChangeRef.current?.(false);
                }
            }
        };

        void load();

        return () => {
            disposed = true;
        };
    }, [blueprint, sceneLoadOptions, scaleKey, texturePathsKey]);

    useFrame((_, delta) => {
        managerRef.current?.tick(delta);
    });

    return null;
};
