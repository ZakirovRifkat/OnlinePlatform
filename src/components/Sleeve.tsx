import { useGLTF } from "@react-three/drei";

export default function Sleeve({ ...props }: any) {
    const model: any = useGLTF("/sleeve.glb");


        // Настройка свойств материала из GLTF-модели
        model.nodes.Sleeve.material.displacementScale = 0;
        model.nodes.Sleeve.material.map = props.colorMap;
        model.nodes.Sleeve.material.displacementMap = props.displacementMap;
        model.nodes.Sleeve.material.normalMap = props.normalMap;
        model.nodes.Sleeve.material.roughnessMap = props.roughnessMap;
        model.nodes.Sleeve.material.metalnessMap = props.Metalness;


    return (
        <mesh
            geometry={model.nodes.Sleeve.geometry}
            material={model.nodes.Sleeve.material}
            scale={5}
            position={[-0.93, -0.7, -1.3]}
            rotation={[Math.PI / 2, 0, 0]}
        />
    );
}

useGLTF.preload("/sleeve.glb");
