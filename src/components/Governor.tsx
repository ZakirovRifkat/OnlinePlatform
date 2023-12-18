import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function Governor(props: any) {
    const a: any = useGLTF("/governor/governor.glb");
    const meshRef: any = useRef(null);
    useFrame(() => (meshRef.current.rotation.z += 0.001));
    return (
        <group {...props} dispose={null}>
            <mesh
                ref={meshRef}
                geometry={a.nodes.Governor2.geometry}
                material={a.nodes.Governor2.material}
                position={[-3, -15, 2]}
                rotation={[Math.PI / 2, 0, 0]}
            >
                <meshStandardMaterial color="silver" />
            </mesh>
        </group>
    );
}

useGLTF.preload("/governor.glb");
