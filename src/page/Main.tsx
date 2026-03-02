import styled from "styled-components";
import { Preloader } from "./Preloader";
import { Content } from "./Content";
import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { Wiki } from "./Wiki";
import { Texture } from "three";
import { Dispatch, SetStateAction } from "react";

type MainProps = {
    colorMap: Texture;
    displacementMap: Texture;
    normalMap: Texture;
    roughnessMap: Texture;
    isModelLoaded: boolean;
    setModelLoaded: Dispatch<SetStateAction<boolean>>;
};

export const Main = ({
    colorMap,
    displacementMap,
    normalMap,
    roughnessMap,
    isModelLoaded,
    setModelLoaded,
}: MainProps) => {
    const location = useLocation();

    return (
        <Container>
            <AnimatePresence>
                <Routes location={location} key={location.pathname}>
                    <Route path="/wiki/*" element={<Wiki />} />
                </Routes>
            </AnimatePresence>
            <Preloader isModelLoaded={isModelLoaded} />
            <Content
                colorMap={colorMap}
                displacementMap={displacementMap}
                normalMap={normalMap}
                roughnessMap={roughnessMap}
                isModelLoaded={isModelLoaded}
                setModelLoaded={setModelLoaded}
            />
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    height: 100vh;
    position: relative;
    overflow: hidden;
`;
