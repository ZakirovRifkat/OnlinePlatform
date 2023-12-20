import { Canvas } from "@react-three/fiber";
import { styled } from "styled-components";
import { Environment, OrbitControls } from "@react-three/drei";
import { Governor } from "./Governor";
import { Suspense } from "react";
import { Preloader } from "../page/Preloader";

export const GovernorModel = ({ ...props }: any) => {
    return (
        <Container>
            <Canvas
                style={{
                    height: "100%",
                    width: "100%",
                    background: "transparent",
                }}
                camera={{
                    fov: 40,
                    position: [0, 0, -20],
                }}
            >
                <scene backgroundIntensity={0}>
                    <ambientLight intensity={1} />
                    <pointLight position={[124, 10, 10]} />

                    <OrbitControls maxDistance={20} minDistance={10} />
                    <Environment preset="warehouse" background blur={100} />
                    <Governor
                        colorMap={props.colorMap}
                        displacementMap={props.displacementMap}
                        normalMap={props.normalMap}
                        roughnessMap={props.roughnessMap}
                        isModelLoaded={props.isModelLoaded}
                        setModelLoaded={props.setModelLoaded}
                    />
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
    background-image: url("/background.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
`;
