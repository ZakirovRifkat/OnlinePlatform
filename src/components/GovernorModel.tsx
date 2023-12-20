import { Canvas } from "@react-three/fiber";
import { styled } from "styled-components";
import { Environment, OrbitControls } from "@react-three/drei";
import { Governor } from "./Governor";

export const GovernorModel = () => {
    return (
        <Container>
            <Canvas
                style={{ height: "100%", width: "100%", background: "black" }}
                camera={{
                    fov: 40,
                    position: [0, 0, -20],
                }}
            >
                <scene backgroundIntensity={0}>
                    <ambientLight intensity={1} />
                    <pointLight position={[124, 10, 10]} />
                    <OrbitControls />
                    <Environment preset="warehouse" background blur={100} />
                    <Governor />
                </scene>
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
