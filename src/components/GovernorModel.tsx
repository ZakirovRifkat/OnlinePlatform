import { Canvas } from "@react-three/fiber";
import { styled } from "styled-components";
import Governor from "./Governor";
import {
    OrbitControls,
    PointerLockControls,
    Sky,
    useTexture,
} from "@react-three/drei";

import floorTexture from "/texture.png";
import * as THREE from "three";

export const Ground = () => {
    const texture = useTexture(floorTexture);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

    return (
        <mesh position={[0, -10, 0]} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[500, 500]} />
            <meshStandardMaterial color="grey" />
        </mesh>
    );
};

export const GovernorModel = () => {
    return (
        <Container>
            <Canvas
                style={{ height: "100%", width: "100%" }}
                camera={{
                    fov: 45,
                    position: [0, -5, -70],
                }}
            >
                <axesHelper />
                <Sky sunPosition={[100, 20, 100]} />
                <ambientLight intensity={1.5} />
                <Ground />
                <pointLight position={[10, 10, 10]} />
                <Governor />
                <OrbitControls />
            </Canvas>
        </Container>
    );
};

const Container = styled.div``;
