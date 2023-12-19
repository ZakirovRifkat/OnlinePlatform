import { Canvas, useFrame } from "@react-three/fiber";
import { styled } from "styled-components";
import Governor from "./Governor";
import { OrbitControls, useTexture } from "@react-three/drei";
import floorTexture from "/texture.png";
import * as THREE from "three";
import { useEffect, useRef } from "react";

export const Ground = () => {
    const texture = useTexture(floorTexture);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

    return (
        <mesh position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[500, 500]} />
            <meshStandardMaterial color="grey" />
        </mesh>
    );
};
const Gov = () => {
    const sphere = new THREE.SphereGeometry(2, 32, 32);
    const box = new THREE.BoxGeometry(10, 1.2, 1.2);
    const box2 = new THREE.CylinderGeometry(1, 1, 13);
    const groupRef: any = useRef(null);
    const groupRef2: any = useRef(null);
    const groupRef3: any = useRef(null);
    let count = 45;
    let angle = 1;
    useFrame(() => {
        count += angle;
        console.log(count);

        if (count > 85 || count < 30) {
            angle = -1 * angle;
        }
        groupRef.current.rotation.y += THREE.MathUtils.degToRad(1);
        groupRef.current.position.y += THREE.MathUtils.degToRad(angle);
        groupRef2.current.rotation.z += THREE.MathUtils.degToRad(angle);
        groupRef3.current.rotation.z += THREE.MathUtils.degToRad(-angle);
    });
    return (
        <>
            <group ref={groupRef}>
                {/* Левый  */}
                <group position={[2, 3, 0]} ref={groupRef2}>
                    <mesh
                        position={[0, 0, 0]}
                        scale={[1, 1, 1]}
                        geometry={new THREE.SphereGeometry(1, 16, 16)}
                    >
                        <meshStandardMaterial attach="material" color="green" />
                    </mesh>
                    <group
                        position={[
                            2.25 * Math.sqrt(2),
                            -2.25 * Math.sqrt(2),
                            0,
                        ]}
                        rotation={[0, 0, -Math.PI / 4]}
                    >
                        {/* Прямоугольник (куб) */}
                        <mesh geometry={box}>
                            <meshStandardMaterial
                                attach="material"
                                color="red"
                            />
                        </mesh>

                        {/* Сфера */}
                        <mesh
                            geometry={sphere}
                            position={[2.25 * Math.sqrt(2), 0, 0]}
                        ></mesh>
                    </group>
                </group>
                {/* Правый */}
                <group position={[-2, 3, 0]} ref={groupRef3}>
                    <mesh
                        position={[0, 0, 0]}
                        scale={[1, 1, 1]}
                        geometry={new THREE.SphereGeometry(1, 16, 16)}
                    >
                        <meshStandardMaterial attach="material" color="green" />
                    </mesh>
                    <group
                        position={[
                            -2.25 * Math.sqrt(2),
                            -2.25 * Math.sqrt(2),
                            0,
                        ]}
                        rotation={[0, 0, (-3 * Math.PI) / 4]}
                    >
                        {/* Прямоугольник (куб) */}
                        <mesh geometry={box}>
                            <meshStandardMaterial
                                attach="material"
                                color="red"
                            />
                        </mesh>

                        {/* Сфера */}
                        <mesh
                            geometry={sphere}
                            position={[2.25 * Math.sqrt(2), 0, 0]}
                        ></mesh>
                    </group>
                </group>
            </group>
            {/* основа */}
            <mesh geometry={box2} position={[0, -2, 0]} rotation={[0, 0, 0]}>
                <meshStandardMaterial attach="material" color="silver" />
            </mesh>
        </>
    );
};
export const GovernorModel = () => {
    return (
        <Container>
            <Canvas
                style={{ height: "100%", width: "100%", background: "black" }}
                camera={{
                    fov: 40,
                    position: [0, 0, -70],
                }}
            >
                {/* <Sky sunPosition={[100, 20, 100]} /> */}
                <ambientLight intensity={1.5} />
                {/* <Ground /> */}
                <pointLight position={[10, 10, 10]} />
                {/* <Governor /> */}
                <OrbitControls />
                <Gov></Gov>
            </Canvas>
        </Container>
    );
};

const Container = styled.div`
    height: 100vh;
    width: 100%;
    position: fixed;
    overflow: hidden;
    top: 0;
`;
