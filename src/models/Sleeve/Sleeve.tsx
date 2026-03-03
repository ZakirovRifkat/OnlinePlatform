import { useGLTF } from "@react-three/drei";
import type { Mesh, MeshStandardMaterial } from "three";
import type { GLTF } from "three-stdlib";
import type { MaterialMapsProps } from "../types";
import { applyMaterialMaps } from "../material";

type SleeveGLTF = GLTF & {
    nodes: {
        Sleeve: Mesh;
    };
};

export const Sleeve = (props: MaterialMapsProps) => {
    const model = useGLTF("/sleeve.glb") as SleeveGLTF;

    applyMaterialMaps(
        model.nodes.Sleeve.material as MeshStandardMaterial,
        props,
    );

    return (
        <mesh
            geometry={model.nodes.Sleeve.geometry}
            material={model.nodes.Sleeve.material}
            scale={5}
            position={[-0.93, -0.7, -1.3]}
            rotation={[Math.PI / 2, 0, 0]}
        />
    );
};

useGLTF.preload("/sleeve.glb");
