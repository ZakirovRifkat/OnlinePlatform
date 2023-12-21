import { Canvas } from "@react-three/fiber";
import { styled } from "styled-components";
import { Environment, OrbitControls } from "@react-three/drei";
import { Governor } from "./Governor";

export const GovernorModel = ({ ...props }: any) => {
    return (
        <Container $opacity={props.isModelLoaded}>
            <Canvas
                style={{
                    height: "100%",
                    width: "100%",
                    background: "transparent",
                }}
                camera={{
                    fov: 50,
                    position: [0, 2, -20],
                }}
            >
                <scene backgroundIntensity={0}>
                    <ambientLight intensity={1} />
                    <pointLight position={[124, 10, 10]} />

                    <OrbitControls
                        maxDistance={21}
                        minDistance={15}
                        enablePan={false}
                        enabled={props.orbit}
                    />
                    <Environment preset="warehouse" background blur={100} />

                    <Governor
                        colorMap={props.colorMap}
                        displacementMap={props.displacementMap}
                        normalMap={props.normalMap}
                        roughnessMap={props.roughnessMap}
                        isModelLoaded={props.isModelLoaded}
                        setModelLoaded={props.setModelLoaded}
                        play={props.play}
                    />
                </scene>
            </Canvas>
        </Container>
    );
};

const Container = styled.div<{ $opacity: boolean }>`
    height: 100vh;
    width: 100%;
    position: fixed;
    overflow: hidden;
    top: 0;
    background-image: url("/background.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    opacity: ${(props) => (props.$opacity ? 1 : 0)};
    transition: opacity 1s ease-in;
`;
