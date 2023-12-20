import { useGLTF } from "@react-three/drei";

export default function GoverLink({ ...props }: any) {
    const model: any = useGLTF("/link.glb");

    // Настройка свойств материала из GLTF-модели
    model.nodes.Link.material.map = props.colorMap;
    model.nodes.Link.material.displacementScale = 0;
    model.nodes.Link.material.displacementMap = props.displacementMap;
    model.nodes.Link.material.normalMap = props.normalMap;
    model.nodes.Link.material.roughnessMap = props.roughnessMap;
    model.nodes.Link.material.metalnessMap = props.Metalness;

    return (
        <mesh
            geometry={model.nodes.Link.geometry}
            material={model.nodes.Link.material}
            scale={5}
            position={[6.642, 1.011, -0.22]}
            rotation={[Math.PI / 2, Math.PI, 0]}
        />
    );
}

useGLTF.preload("/link.glb");
