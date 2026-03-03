import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import type { Mesh, MeshStandardMaterial } from "three";
import type { GLTF } from "three-stdlib";
import type { MaterialMapsProps } from "../types";
import { applyMaterialMaps } from "../material";

type KnuckleGLTF = GLTF & {
    nodes: {
        Knuckle: Mesh;
    };
};

type KnuckleProps = MaterialMapsProps & {
    lengthFactor?: number;
    knuckleScale?: number;
    pivotMode?: "end" | "center" | "front" | "back";
};

export const KnuckleCopy = ({
    lengthFactor = 1,
    knuckleScale = 5,
    pivotMode = "end",
    ...materialMaps
}: KnuckleProps) => {
    const model = useGLTF("/knuckle.glb") as KnuckleGLTF;

    applyMaterialMaps(
        model.nodes.Knuckle.material as MeshStandardMaterial,
        materialMaps,
    );

    const stretchedGeometry = useMemo(() => {
        const geometry = model.nodes.Knuckle.geometry.clone();

        if (Math.abs(lengthFactor - 1) < 1e-6) {
            return geometry;
        }

        geometry.computeBoundingBox();
        if (!geometry.boundingBox) {
            return geometry;
        }

        const size = new THREE.Vector3();
        geometry.boundingBox.getSize(size);

        const stretchAxis =
            size.x >= size.y && size.x >= size.z
                ? "x"
                : size.y >= size.z
                  ? "y"
                  : "z";

        const anchor = geometry.boundingBox.max[stretchAxis];
        const positions = geometry.attributes.position;

        for (let index = 0; index < positions.count; index += 1) {
            const coordinate =
                stretchAxis === "x"
                    ? positions.getX(index)
                    : stretchAxis === "y"
                      ? positions.getY(index)
                      : positions.getZ(index);
            const stretchedCoordinate =
                anchor + (coordinate - anchor) * lengthFactor;

            if (stretchAxis === "x") {
                positions.setX(index, stretchedCoordinate);
            } else if (stretchAxis === "y") {
                positions.setY(index, stretchedCoordinate);
            } else {
                positions.setZ(index, stretchedCoordinate);
            }
        }

        positions.needsUpdate = true;
        geometry.computeVertexNormals();
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();

        if (pivotMode === "center") {
            geometry.center();
            geometry.computeBoundingBox();
            geometry.computeBoundingSphere();
        } else if (pivotMode === "front" || pivotMode === "back") {
            geometry.computeBoundingBox();
            if (geometry.boundingBox) {
                const size = new THREE.Vector3();
                geometry.boundingBox.getSize(size);

                const pivotAxis =
                    size.x >= size.y && size.x >= size.z
                        ? "x"
                        : size.y >= size.z
                          ? "y"
                          : "z";

                const pivotPoint =
                    pivotMode === "front"
                        ? geometry.boundingBox.max[pivotAxis]
                        : geometry.boundingBox.min[pivotAxis];

                if (pivotAxis === "x") {
                    geometry.translate(-pivotPoint, 0, 0);
                } else if (pivotAxis === "y") {
                    geometry.translate(0, -pivotPoint, 0);
                } else {
                    geometry.translate(0, 0, -pivotPoint);
                }

                geometry.computeBoundingBox();
                geometry.computeBoundingSphere();
            }
        }

        return geometry;
    }, [lengthFactor, model.nodes.Knuckle.geometry, pivotMode]);

    return (
        <mesh
            geometry={stretchedGeometry}
            material={model.nodes.Knuckle.material}
            scale={knuckleScale}
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
        />
    );
};

useGLTF.preload("/knuckle.glb");
