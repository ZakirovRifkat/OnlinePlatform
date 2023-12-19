import { Canvas, useFrame } from "@react-three/fiber";
import { styled } from "styled-components";
import Governor from "./Governor";
import { OrbitControls, useTexture } from "@react-three/drei";
import floorTexture from "/texture.png";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { Color } from "three";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
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
    const main = useLoader(OBJLoader, "/Spindle.obj");
    const link = useLoader(OBJLoader, "/Link.obj");
    const link2 = useLoader(OBJLoader, "/Link2.obj");

    const groupRef: any = useRef(null);
    const leftHandle: any = useRef(null);
    const rightHandle: any = useRef(null);
    let count = 45;
    let angle = 1;
    useFrame(() => {
        count += angle;
        // console.log(count);

        if (count > 85 || count < 30) {
            angle = -1 * angle;
        }
        // groupRef.current.rotation.y += THREE.MathUtils.degToRad(1);
        // groupRef.current.position.y += THREE.MathUtils.degToRad(angle);
        // leftHandle.current.rotation.z += THREE.MathUtils.degToRad(angle);
        // rightHandle.current.rotation.z += THREE.MathUtils.degToRad(-angle);
    });
    return (
        <>
            <group ref={groupRef}>
                {/* Левый  */}
                <group
                    position={[1.05, 4.67, 0]}
                    rotation={[0, 0, Math.PI / 6]}
                    ref={leftHandle}
                >
                    {/* <mesh
                        position={[0, 0, 0]}
                        scale={[1, 1, 1]}
                        geometry={new THREE.SphereGeometry(0.15, 16, 16)}
                    >
                        <meshStandardMaterial
                            attach="material"
                            color="#ffffff"
                        />
                    </mesh> */}

                    <mesh rotation={[0, 0, -Math.PI / 2]}>
                        {/* Прямоугольник (куб) */}
                        <primitive
                            object={link}
                            scale={[5, 5, 5]}
                            position={[6.5, 1, -0.2]}
                            rotation={[Math.PI, Math.PI, 0]}
                        ></primitive>
                        {/* Сфера */}
                        <mesh
                            position={[5.8, 0.5, 0.02]}
                            scale={[1, 1, 1]}
                            geometry={new THREE.SphereGeometry(0.7, 32, 32)}
                        >
                            <meshStandardMaterial
                                attach="material"
                                color="blue"
                            />
                        </mesh>
                    </mesh>
                </group>
                {/* Правый */}
                <group
                    position={[-1.05, 4.67, 0]}
                    rotation={[0, Math.PI, Math.PI / 6]}
                    ref={rightHandle}
                >
                    {/* <mesh
                        position={[0, 0, 0]}
                        scale={[1, 1, 1]}
                        geometry={new THREE.SphereGeometry(0.15, 16, 16)}
                    >
                        <meshStandardMaterial
                            attach="material"
                            color="#ffffff"
                        />
                    </mesh> */}

                    <mesh rotation={[0, 0, -Math.PI / 2]}>
                        {/* Прямоугольник (куб) */}
                        <primitive
                            object={link2}
                            scale={[5, 5, 5]}
                            position={[6.5, 1, -0.2]}
                            rotation={[Math.PI, Math.PI, 0]}
                        ></primitive>
                        {/* Сфера */}
                        <mesh
                            position={[5.8, 0.5, 0.02]}
                            scale={[1, 1, 1]}
                            geometry={new THREE.SphereGeometry(0.7, 32, 32)}
                        >
                            <meshStandardMaterial
                                attach="material"
                                color="blue"
                            />
                        </mesh>
                    </mesh>
                </group>
            </group>
            {/* основа */}
            <mesh rotation={[0, Math.PI / 2, 0]}>
                <primitive
                    object={main}
                    scale={[5, 5, 5]}
                    position={[-1, -5, -1.2]}
                />
                <mesh
                    position={[0, 0, 0]}
                    scale={[1, 1, 1]}
                    geometry={new THREE.SphereGeometry(1, 16, 16)}
                >
                    <meshStandardMaterial attach="material" color="green" />
                </mesh>
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
