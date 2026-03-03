import { useGLTF } from "@react-three/drei";
import type { Mesh, MeshStandardMaterial } from "three";
import type { GLTF } from "three-stdlib";
import type { MaterialMapsProps } from "../types";
import { applyMaterialMaps } from "../material";

type GovernorLinkGLTF = GLTF & {
    nodes: {
        Link: Mesh;
    };
};

export const GovernorLink = (props: MaterialMapsProps) => {
    const model = useGLTF("/link.glb") as GovernorLinkGLTF;

    applyMaterialMaps(model.nodes.Link.material as MeshStandardMaterial, props);

    return (
        <mesh
            geometry={model.nodes.Link.geometry}
            material={model.nodes.Link.material}
            scale={5}
            position={[6.642, 1.011, -0.22]}
            rotation={[Math.PI / 2, Math.PI, 0]}
        />
    );
};

useGLTF.preload("/link.glb");
