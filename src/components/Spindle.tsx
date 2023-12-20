import { useGLTF } from "@react-three/drei";

export default function Spindle({ ...props }: any) {
    const model: any = useGLTF("/spindle.glb");

    // Настройка свойств материала из GLTF-модели
    model.nodes.Spindle.material.displacementScale = 0;
    model.nodes.Spindle.material.map = props.colorMap;
    model.nodes.Spindle.material.displacementMap = props.displacementMap;
    model.nodes.Spindle.material.normalMap = props.normalMap;
    model.nodes.Spindle.material.roughnessMap = props.roughnessMap;
    model.nodes.Spindle.material.metalnessMap = props.Metalness;

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
