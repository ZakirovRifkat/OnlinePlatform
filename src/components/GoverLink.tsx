import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";

export default function GoverLink() {
    const model: any = useGLTF("/link.glb");

    const name = (type: any) => `/Metal/Metal035_1K-JPG_${type}.jpg`;
    const [colorMap, displacementMap, normalMap, roughnessMap, Metalness] =
        useLoader(TextureLoader, [
            name("Color"),
            name("Displacement"),
            name("NormalGL"),
            name("Roughness"),
            name("Metalness"),
        ]);

    useEffect(() => {
        // Настройка свойств материала из GLTF-модели
        model.nodes.Link.material.map = colorMap;
        model.nodes.Link.material.displacementScale = 0;
        model.nodes.Link.material.displacementMap = displacementMap;
        model.nodes.Link.material.normalMap = normalMap;
        model.nodes.Link.material.roughnessMap = roughnessMap;
        model.nodes.Link.material.metalnessMap = Metalness;
    }, []);

    return (
        <mesh
            geometry={model.nodes.Link.geometry}
            material={model.nodes.Link.material}
            scale={5}
            position={[6.58, 1.02, -0.22]}
            rotation={[Math.PI / 2, Math.PI, 0]}
        />
    );
}

useGLTF.preload("/link.glb");
