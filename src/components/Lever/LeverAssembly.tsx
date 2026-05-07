import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import {
    AxesHelper,
    Box3,
    Group,
    Matrix4,
    Mesh,
    MeshBasicMaterial,
    MeshStandardMaterial,
    Object3D,
    SphereGeometry,
    Texture,
    TextureLoader,
    Vector3,
    SRGBColorSpace,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type {
    AxisName,
    BoundAnchor,
    BoundAnchorValue,
    LeverRightPosition,
    SceneHost,
    TransformBlueprint,
    Vec3,
} from "./types";

export interface LeverAssemblyTextures {
    colorMapUrl?: string;
    normalMapUrl?: string;
    roughnessMapUrl?: string;
    metalnessMapUrl?: string;
}

export interface LeverAssemblyProps {
    host: SceneHost | null;
    leverUrl: string;
    leverLeftUrl?: string;
    leverRightUrl?: string;
    rivetUrl?: string;
    leverLeftScale?: number | Vec3;
    leverRightScale?: number | Vec3;
    sceneTransform?: TransformBlueprint;
    textures?: LeverAssemblyTextures;
    pivotAxis?: AxisName;
    resolveAngle: (elapsedSec: number) => number;
    showOrigin?: boolean;
    showPivot?: boolean;
    sleeveProgress?: number;
    onLeverRightPositionChange?: (position: LeverRightPosition) => void;
}

const LEFT_ANCHOR_PARENT: BoundAnchor = { x: 0, y: 0.94, z: 0.05 };
const LEFT_ANCHOR_SELF: BoundAnchor = { x: "center", y: 0.12, z: "center" };

const RIGHT_ANCHOR_PARENT: BoundAnchor = { x: 1, y: 0.06, z: 0.95 };
const RIGHT_ANCHOR_SELF: BoundAnchor = { x: "center", y: 0.88, z: "center" };

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

const toScaleVec = (value: number | Vec3 | undefined): Vec3 => {
    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value === "number") {
        return [value, value, value];
    }

    return [1, 1, 1];
};

const applyTransform = (
    target: Object3D,
    config: TransformBlueprint | undefined,
) => {
    if (!config) {
        return;
    }

    if (config.position) {
        target.position.set(...config.position);
    }

    if (config.rotationDeg) {
        target.rotation.set(
            toRadians(config.rotationDeg[0]),
            toRadians(config.rotationDeg[1]),
            toRadians(config.rotationDeg[2]),
        );
    }

    const scale = toScaleVec(config.scale);
    target.scale.set(...scale);
};

const resolveBoundValue = (
    bounds: Box3,
    axis: AxisName,
    edge: BoundAnchorValue,
) => {
    if (typeof edge === "number") {
        const t = Math.max(0, Math.min(1, edge));
        return bounds.min[axis] + (bounds.max[axis] - bounds.min[axis]) * t;
    }

    if (edge === "min") {
        return bounds.min[axis];
    }

    if (edge === "max") {
        return bounds.max[axis];
    }

    return (bounds.min[axis] + bounds.max[axis]) * 0.5;
};

const resolveBoundPoint = (bounds: Box3, anchor: BoundAnchor) =>
    new Vector3(
        resolveBoundValue(bounds, "x", anchor.x),
        resolveBoundValue(bounds, "y", anchor.y),
        resolveBoundValue(bounds, "z", anchor.z),
    );

/** Compute AABB in the object's own local space (ignoring parent transforms). */
const computeLocalBounds = (obj: Object3D): Box3 => {
    obj.updateWorldMatrix(true, true);
    const box = new Box3();
    const invMatrix = obj.matrixWorld.clone().invert();

    obj.traverse((child) => {
        const mesh = child as Mesh;
        if (!mesh.isMesh || !mesh.geometry) return;
        mesh.geometry.computeBoundingBox();
        if (!mesh.geometry.boundingBox) return;

        const geoBox = mesh.geometry.boundingBox.clone();
        const toLocal = new Matrix4()
            .copy(invMatrix)
            .multiply(mesh.matrixWorld);
        geoBox.applyMatrix4(toLocal);
        box.union(geoBox);
    });

    return box;
};

const stripHelperNodes = (root: Group) => {
    const toRemove: Object3D[] = [];

    root.traverse((node) => {
        if ((node as { isCamera?: boolean }).isCamera) {
            toRemove.push(node);
            return;
        }

        if ((node as { isLight?: boolean }).isLight) {
            toRemove.push(node);
        }
    });

    for (const node of toRemove) {
        node.parent?.remove(node);
    }
};

const loadTextureMaps = async (textures: LeverAssemblyTextures | undefined) => {
    if (!textures) {
        return null;
    }

    const loader = new TextureLoader();
    const entries = await Promise.all([
        textures.colorMapUrl
            ? loader
                  .loadAsync(textures.colorMapUrl)
                  .then((texture) => ["map", texture] as const)
            : Promise.resolve(null),
        textures.normalMapUrl
            ? loader
                  .loadAsync(textures.normalMapUrl)
                  .then((texture) => ["normalMap", texture] as const)
            : Promise.resolve(null),
        textures.roughnessMapUrl
            ? loader
                  .loadAsync(textures.roughnessMapUrl)
                  .then((texture) => ["roughnessMap", texture] as const)
            : Promise.resolve(null),
        textures.metalnessMapUrl
            ? loader
                  .loadAsync(textures.metalnessMapUrl)
                  .then((texture) => ["metalnessMap", texture] as const)
            : Promise.resolve(null),
    ]);

    const maps = Object.fromEntries(
        entries.filter(Boolean) as Array<[string, Texture]>,
    );
    const colorMap = maps.map;
    if (colorMap) {
        colorMap.colorSpace = SRGBColorSpace;
    }

    return maps as Partial<
        Record<"map" | "normalMap" | "roughnessMap" | "metalnessMap", Texture>
    >;
};

const applyMapsToModel = (
    root: Group,
    maps: Partial<
        Record<"map" | "normalMap" | "roughnessMap" | "metalnessMap", Texture>
    > | null,
) => {
    if (!maps) {
        return;
    }

    root.traverse((node) => {
        const mesh = node as Mesh;
        if (!mesh.isMesh) {
            return;
        }

        const material = mesh.material;
        if (!material || Array.isArray(material)) {
            return;
        }

        const standard = material as MeshStandardMaterial;
        if (!standard.isMeshStandardMaterial) {
            return;
        }

        standard.map = maps.map ?? standard.map;
        standard.normalMap = maps.normalMap ?? standard.normalMap;
        standard.roughnessMap = maps.roughnessMap ?? standard.roughnessMap;
        standard.metalnessMap = maps.metalnessMap ?? standard.metalnessMap;
        standard.needsUpdate = true;
    });
};

export const LeverAssembly = ({
    host,
    leverUrl,
    leverLeftUrl = "/models/lever_left.gltf",
    leverRightUrl = "/models/lever_right.gltf",
    rivetUrl = "/models/rivet.gltf",
    leverLeftScale,
    leverRightScale,
    sceneTransform,
    textures,
    pivotAxis = "x",
    resolveAngle,
    showOrigin = false,
    showPivot = false,
    sleeveProgress = 0,
    onLeverRightPositionChange,
}: LeverAssemblyProps) => {
    const resolveAngleRef = useRef(resolveAngle);
    const sleeveProgressRef = useRef(sleeveProgress);
    const mountPropsRef = useRef({
        leverUrl,
        leverLeftUrl,
        leverRightUrl,
        rivetUrl,
        leverLeftScale,
        leverRightScale,
        sceneTransform,
        textures,
        pivotAxis,
        showOrigin,
        showPivot,
    });

    const leverLeftScaleKey = useMemo(
        () => JSON.stringify(leverLeftScale ?? null),
        [leverLeftScale],
    );
    const leverRightScaleKey = useMemo(
        () => JSON.stringify(leverRightScale ?? null),
        [leverRightScale],
    );
    const sceneTransformKey = useMemo(
        () => JSON.stringify(sceneTransform ?? null),
        [sceneTransform],
    );
    const texturesKey = useMemo(
        () => JSON.stringify(textures ?? null),
        [textures],
    );

    useEffect(() => {
        resolveAngleRef.current = resolveAngle;
    }, [resolveAngle]);

    useEffect(() => {
        sleeveProgressRef.current = sleeveProgress;
    }, [sleeveProgress]);

    useEffect(() => {
        mountPropsRef.current = {
            leverUrl,
            leverLeftUrl,
            leverRightUrl,
            rivetUrl,
            leverLeftScale,
            leverRightScale,
            sceneTransform,
            textures,
            pivotAxis,
            showOrigin,
            showPivot,
        };
    }, [
        leverUrl,
        leverLeftUrl,
        leverRightUrl,
        rivetUrl,
        leverLeftScale,
        leverRightScale,
        sceneTransform,
        textures,
        pivotAxis,
        showOrigin,
        showPivot,
    ]);

    useEffect(() => {
        if (!host) {
            return;
        }

        const mountProps = mountPropsRef.current;

        const assemblyRoot = new Group();
        assemblyRoot.name = "lever-assembly-root";
        // Apply only position and rotation to assemblyRoot, not scale
        if (mountProps.sceneTransform) {
            if (mountProps.sceneTransform.position) {
                assemblyRoot.position.set(...mountProps.sceneTransform.position);
            }
            if (mountProps.sceneTransform.rotationDeg) {
                assemblyRoot.rotation.set(
                    toRadians(mountProps.sceneTransform.rotationDeg[0]),
                    toRadians(mountProps.sceneTransform.rotationDeg[1]),
                    toRadians(mountProps.sceneTransform.rotationDeg[2]),
                );
            }
        }
        host.root.add(assemblyRoot);

        let disposed = false;
        let unregisterFrame: (() => void) | null = null;
        const textureRefs: Texture[] = [];

        const initialize = async () => {
            // Get scale from sceneTransform to adjust positions throughout initialization
            const sceneScale = toScaleVec(mountProps.sceneTransform?.scale);
            const effectiveScaleX = sceneScale[0];

            const loader = new GLTFLoader();
            const [lever, left, right, rivetLeft, rivetRight, maps] =
                await Promise.all([
                    loader.loadAsync(mountProps.leverUrl),
                    loader.loadAsync(mountProps.leverLeftUrl),
                    loader.loadAsync(mountProps.leverRightUrl),
                    loader.loadAsync(mountProps.rivetUrl),
                    loader.loadAsync(mountProps.rivetUrl),
                    loadTextureMaps(mountProps.textures),
                ]);

            if (disposed) {
                return;
            }

            const nodes = [
                lever.scene,
                left.scene,
                right.scene,
                rivetLeft.scene,
                rivetRight.scene,
            ];
            for (const node of nodes) {
                stripHelperNodes(node);
            }

            if (maps) {
                Object.values(maps).forEach((map) => {
                    if (map) {
                        textureRefs.push(map);
                    }
                });
                nodes.forEach((node) => applyMapsToModel(node, maps));
            }

            const leverNode = lever.scene;
            const leftNode = left.scene;
            const rightNode = right.scene;

            // Apply scale to all nodes uniformly
            const leftScaleVec = toScaleVec(mountProps.leverLeftScale);
            const rightScaleVec = toScaleVec(mountProps.leverRightScale);

            applyTransform(leverNode, {
                position: [0, 0, 0],
                rotationDeg: [0, 0, 0],
                scale: effectiveScaleX,
            });
            applyTransform(leftNode, {
                position: [0.26, 0, 0],
                rotationDeg: [0, 0, 0],
                scale: [
                    leftScaleVec[0] * effectiveScaleX,
                    leftScaleVec[1] * effectiveScaleX,
                    leftScaleVec[2] * effectiveScaleX,
                ],
            });
            applyTransform(rightNode, {
                position: [-0.26, 0, 0],
                rotationDeg: [0, 0, 0],
                scale: [
                    rightScaleVec[0] * effectiveScaleX,
                    rightScaleVec[1] * effectiveScaleX,
                    rightScaleVec[2] * effectiveScaleX,
                ],
            });

            assemblyRoot.add(leverNode);
            assemblyRoot.add(leftNode);
            assemblyRoot.add(rightNode);

            const leverPivot = new Group();
            leverPivot.name = "lever-pivot";
            assemblyRoot.add(leverPivot);
            leverPivot.add(leverNode);

            // Compute bounds in each node's local space
            // (unaffected by parent rotation / scene transform).
            const leverLocalBounds = computeLocalBounds(leverNode);
            const leftBounds = computeLocalBounds(leftNode);
            const rightBounds = computeLocalBounds(rightNode);

            // Bounds-center pivot: shift lever so its geometry center
            // aligns with the pivot origin.
            const leverCenter = new Vector3();
            leverLocalBounds.getCenter(leverCenter);
            leverNode.position.sub(leverCenter);

            // After shifting position, update matrices before localToWorld.
            leverPivot.updateWorldMatrix(true, true);
            leftNode.updateWorldMatrix(true, false);
            rightNode.updateWorldMatrix(true, false);

            // Resolve anchors in each node's local space,
            // then convert to world space.
            const leftAnchorWorld = leverNode.localToWorld(
                resolveBoundPoint(leverLocalBounds, LEFT_ANCHOR_PARENT),
            );
            const rightAnchorWorld = leverNode.localToWorld(
                resolveBoundPoint(leverLocalBounds, RIGHT_ANCHOR_PARENT),
            );
            const leftSelfAnchorWorld = leftNode.localToWorld(
                resolveBoundPoint(leftBounds, LEFT_ANCHOR_SELF),
            );
            const rightSelfAnchorWorld = rightNode.localToWorld(
                resolveBoundPoint(rightBounds, RIGHT_ANCHOR_SELF),
            );

            const leftOriginWorld = leftNode.getWorldPosition(new Vector3());
            const rightOriginWorld = rightNode.getWorldPosition(new Vector3());
            const leftSelfOffset = leftOriginWorld
                .clone()
                .sub(leftSelfAnchorWorld);
            const rightSelfOffset = rightOriginWorld
                .clone()
                .sub(rightSelfAnchorWorld);

            // Keep configurable local offsets (legacy +/-0.26 on X) in final placement.
            const leftConfigOffset = new Vector3(0.26, 0, 0);
            const rightConfigOffset = new Vector3(-0.26, 0, 0);

            const leftTargetLocal = assemblyRoot.worldToLocal(
                leftAnchorWorld.clone().add(leftSelfOffset),
            );
            const rightTargetLocal = assemblyRoot.worldToLocal(
                rightAnchorWorld.clone().add(rightSelfOffset),
            );
            // Keep legacy offsets in assembly-local space so placement remains stable
            // even when the whole assembly is inserted into a transformed scene.
            leftTargetLocal.add(leftConfigOffset);
            rightTargetLocal.add(rightConfigOffset);
            leftNode.position.copy(leftTargetLocal);
            rightNode.position.copy(rightTargetLocal);

            const leftBasePos = leftNode.position.clone();
            const rightBasePos = rightNode.position.clone();
            const leftRodHeight = Math.max(
                leftBounds.max.y - leftBounds.min.y,
                0.0001,
            );
            const rightRodHeight = Math.max(
                rightBounds.max.y - rightBounds.min.y,
                0.0001,
            );

            leverPivot.updateWorldMatrix(true, true);
            const leftAnchorLocal = leverPivot.worldToLocal(
                leftAnchorWorld.clone(),
            );
            const rightAnchorLocal = leverPivot.worldToLocal(
                rightAnchorWorld.clone(),
            );

            leftNode.add(rivetLeft.scene);
            rightNode.add(rivetRight.scene);
            rivetLeft.scene.position.set(0, 0, 0);
            rivetLeft.scene.rotation.set(0, 0, 0);
            rivetRight.scene.position.set(0, 0, 0);
            rivetRight.scene.rotation.set(0, 0, 0);

            if (mountProps.showOrigin) {
                // lever origin — green
                const leverAxes = new AxesHelper(0.4);
                const leverSphere = new Mesh(
                    new SphereGeometry(0.06, 16, 12),
                    new MeshBasicMaterial({
                        color: 0x00ff00,
                        depthTest: false,
                    }),
                );
                leverSphere.renderOrder = 999;
                leverNode.add(leverAxes);
                leverNode.add(leverSphere);

                // lever_left origin — red
                const leftAxes = new AxesHelper(0.4);
                const leftSphere = new Mesh(
                    new SphereGeometry(0.06, 16, 12),
                    new MeshBasicMaterial({
                        color: 0xff0000,
                        depthTest: false,
                    }),
                );
                leftSphere.renderOrder = 999;
                leftNode.add(leftAxes);
                leftNode.add(leftSphere);

                // lever_right origin — yellow
                const rightAxes = new AxesHelper(0.4);
                const rightSphere = new Mesh(
                    new SphereGeometry(0.06, 16, 12),
                    new MeshBasicMaterial({
                        color: 0xffff00,
                        depthTest: false,
                    }),
                );
                rightSphere.renderOrder = 999;
                rightNode.add(rightAxes);
                rightNode.add(rightSphere);
            }

            unregisterFrame = host.registerFrame((elapsedSec) => {
                const angle = resolveAngleRef.current(elapsedSec);

                leverPivot.rotation.x = 0;
                leverPivot.rotation.y = 0;
                leverPivot.rotation.z = 0;
                leverPivot.rotation[mountProps.pivotAxis] = angle;

                leverPivot.updateWorldMatrix(true, true);

                const leftAnchorNow = leftAnchorLocal.clone();
                leverPivot.localToWorld(leftAnchorNow);
                const leftAnchorLocalScene =
                    assemblyRoot.worldToLocal(leftAnchorNow);
                leftNode.position.x = leftBasePos.x;
                leftNode.position.y = leftAnchorLocalScene.y + leftSelfOffset.y;
                leftNode.position.z = leftBasePos.z;
                const leftDz = leftAnchorLocalScene.z - leftBasePos.z;
                leftNode.rotation[mountProps.pivotAxis] =
                    -Math.atan2(leftDz, leftRodHeight) * 0.9;

                const rightAnchorNow = rightAnchorLocal.clone();
                leverPivot.localToWorld(rightAnchorNow);
                const rightAnchorLocalScene =
                    assemblyRoot.worldToLocal(rightAnchorNow);
                rightNode.position.x = rightBasePos.x;
                rightNode.position.y =
                    rightAnchorLocalScene.y + rightSelfOffset.y;
                rightNode.position.z = rightBasePos.z;
                const rightDz = rightAnchorLocalScene.z - rightBasePos.z;
                rightNode.rotation[mountProps.pivotAxis] =
                    Math.atan2(rightDz, rightRodHeight) * 0.9;

                // Notify parent of lever_right position
                if (onLeverRightPositionChange) {
                    const rightWorldPos = rightNode.getWorldPosition(
                        new THREE.Vector3(),
                    );
                    // Calculate displacement from base position
                    const yDisplacement = rightNode.position.y - rightBasePos.y;

                    onLeverRightPositionChange({
                        x: rightWorldPos.x,
                        y: rightWorldPos.y,
                        yDisplacement: yDisplacement,
                    });
                }
            });
        };

        void initialize();

        return () => {
            disposed = true;
            unregisterFrame?.();
            host.root.remove(assemblyRoot);
            textureRefs.forEach((texture) => texture.dispose());
        };
    }, [
        host,
        leverUrl,
        leverLeftUrl,
        leverRightUrl,
        rivetUrl,
        leverLeftScaleKey,
        leverRightScaleKey,
        sceneTransformKey,
        texturesKey,
        pivotAxis,
        showOrigin,
        showPivot,
    ]);

    return null;
};
