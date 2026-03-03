import { useGLTF } from "@react-three/drei";
import type { Mesh, MeshStandardMaterial } from "three";
import type { GLTF } from "three-stdlib";
import type { MaterialMapsProps } from "../types";
import { applyMaterialMaps } from "../material";

type SpindleGLTF = GLTF & {
    nodes: {
        Spindle: Mesh;
    };
};

export const Spindle = (props: MaterialMapsProps) => {
    const model = useGLTF("/spindle.glb") as SpindleGLTF;

    applyMaterialMaps(
        model.nodes.Spindle.material as MeshStandardMaterial,
        props,
    );

    return (
        <mesh
            geometry={model.nodes.Spindle.geometry}
            material={model.nodes.Spindle.material}
            scale={5}
            position={[7, -0.2, -1]}
            rotation={[Math.PI / 2, 0, Math.PI / 2]}
        />
    );
};

useGLTF.preload("/spindle.glb");
