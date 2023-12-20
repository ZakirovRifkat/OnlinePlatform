import { useGLTF } from "@react-three/drei";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";
import { useLoader } from "@react-three/fiber";
import { useEffect } from "react";

export default function Spindle() {
    const model: any = useGLTF("/spindle.glb");

    const name = (type: any) => `/Metal/Metal035_1K-JPG_${type}.jpg`;

    const [colorMap, displacementMap, normalMap, roughnessMap, Metalness] =
        useLoader(TextureLoader, [
            name("Color"),
            name("Displacement"),
            name("NormalDX"),
            name("Roughness"),
            name("Metalness"),
        ]);

    useEffect(() => {
        // Настройка свойств материала из GLTF-модели
        model.nodes.Spindle.material.displacementScale = 0;
        model.nodes.Spindle.material.map = colorMap;
        model.nodes.Spindle.material.displacementMap = displacementMap;
        model.nodes.Spindle.material.normalMap = normalMap;
        model.nodes.Spindle.material.roughnessMap = roughnessMap;
        model.nodes.Spindle.material.metalnessMap = Metalness;
    }, []);

    return (
        <mesh
            geometry={model.nodes.Spindle.geometry}
            material={model.nodes.Spindle.material}
            scale={5}
            position={[7, -0.2, -1]}
            rotation={[Math.PI / 2, 0, Math.PI / 2]}
        />
    );
}

useGLTF.preload("/spindle.glb");
