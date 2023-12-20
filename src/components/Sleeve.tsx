import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";
import { useLoader } from "@react-three/fiber";

export default function Sleeve() {
    const model: any = useGLTF("/sleeve.glb");
    const meshRef = useRef(null);

    const name = (type: any) => `/Metal/Metal035_1K-JPG_${type}.jpg`;

    const [colorMap, displacementMap, normalMap, roughnessMap, Metalness] =
        useLoader(TextureLoader, [
            name("Color"),
            name("Displacement"),
            name("NormalDX"),
            name("Roughness"),
            name("Metalness"),
        ]);

    // Настройка свойств материала из GLTF-модели
    model.nodes.Sleeve.material.displacementScale = 0;
    model.nodes.Sleeve.material.map = colorMap;
    model.nodes.Sleeve.material.displacementMap = displacementMap;
    model.nodes.Sleeve.material.normalMap = normalMap;
    model.nodes.Sleeve.material.roughnessMap = roughnessMap;
    model.nodes.Sleeve.material.metalnessMap = Metalness;

    return (
        <mesh
            ref={meshRef}
            geometry={model.nodes.Sleeve.geometry}
            material={model.nodes.Sleeve.material}
            scale={5}
            position={[-0.93, -0.7, -1.3]}
            rotation={[Math.PI / 2, 0, 0]}
        />
    );
}

useGLTF.preload("/sleeve.glb");
