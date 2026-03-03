import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";
import type { MaterialMapsProps } from "../types";
import { applyMaterialMaps } from "../material";

type GearGLTF = GLTF & {
    nodes: Record<string, THREE.Object3D>;
};

const getFirstMeshNode = (nodes: Record<string, THREE.Object3D>) =>
    Object.values(nodes).find(
        (node): node is THREE.Mesh => node instanceof THREE.Mesh,
    );

export const GovernonGear = (props: MaterialMapsProps) => {
    const model = useGLTF("/second_gear.glb") as GearGLTF;
    const meshNode = getFirstMeshNode(model.nodes);

    if (!meshNode) {
        return null;
    }

    const material = Array.isArray(meshNode.material)
        ? meshNode.material[0]
        : meshNode.material;

    applyMaterialMaps(material as unknown as THREE.MeshStandardMaterial, props);

    return (
        <mesh
            geometry={meshNode.geometry}
            material={material}
            position={meshNode.position}
            rotation={meshNode.rotation}
            scale={meshNode.scale}
        />
    );
};

useGLTF.preload("/second_gear.glb");
