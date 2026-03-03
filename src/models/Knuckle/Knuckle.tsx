import { useGLTF } from "@react-three/drei";
import type { Mesh, MeshStandardMaterial } from "three";
import type { GLTF } from "three-stdlib";
import type { MaterialMapsProps } from "../types";
import { applyMaterialMaps } from "../material";

type KnuckleGLTF = GLTF & {
    nodes: {
        Knuckle: Mesh;
    };
};

export const Knuckle = (props: MaterialMapsProps) => {
    const model = useGLTF("/knuckle.glb") as KnuckleGLTF;

    applyMaterialMaps(
        model.nodes.Knuckle.material as MeshStandardMaterial,
        props,
    );

    return (
        <mesh
            geometry={model.nodes.Knuckle.geometry}
            material={model.nodes.Knuckle.material}
            scale={5}
            position={[-4.2, -0.4, -0.3]}
            rotation={[Math.PI / 2, 0, 0]}
        />
    );
};

useGLTF.preload("/knuckle.glb");
