import { useGLTF } from "@react-three/drei";

export default function Knuckle({ ...props }: any) {
    const model: any = useGLTF("/knuckle.glb");

    // Настройка свойств материала из GLTF-модели
    model.nodes.Knuckle.material.displacementScale = 0;
    model.nodes.Knuckle.material.map = props.colorMap;
    model.nodes.Knuckle.material.displacementMap = props.displacementMap;
    model.nodes.Knuckle.material.normalMap = props.normalMap;
    model.nodes.Knuckle.material.roughnessMap = props.roughnessMap;
    model.nodes.Knuckle.material.metalnessMap = props.Metalness;

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
