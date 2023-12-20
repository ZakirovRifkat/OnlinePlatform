import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";
import { useLoader } from "@react-three/fiber";

export default function Knuckle() {
    const model: any = useGLTF("/knuckle.glb");

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
        model.nodes.Knuckle.material.displacementScale = 0;
        model.nodes.Knuckle.material.map = colorMap;
        model.nodes.Knuckle.material.displacementMap = displacementMap;
        model.nodes.Knuckle.material.normalMap = normalMap;
        model.nodes.Knuckle.material.roughnessMap = roughnessMap;
        model.nodes.Knuckle.material.metalnessMap = Metalness;
    }, []);

    return (
        <mesh
            geometry={model.nodes.Knuckle.geometry}
            material={model.nodes.Knuckle.material}
            scale={5}
            position={[-4.2, -0.4, -0.3]}
            rotation={[Math.PI / 2, 0, 0]}
        />
    );
}

useGLTF.preload("/knuckle.glb");
