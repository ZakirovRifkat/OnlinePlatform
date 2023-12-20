import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Preloader } from "./Preloader";
import { Content } from "./Content";

export const Main = ({ ...props }: any) => {
    return (
            <Container>
                    <Preloader isModelLoaded={props.isModelLoaded} />
                    <Content
                        colorMap={props.colorMap}
                        displacementMap={props.displacementMap}
                        normalMap={props.normalMap}
                        roughnessMap={props.roughnessMap}
                        isModelLoaded={props.isModelLoaded}
                        setModelLoaded={props.setModelLoaded}
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
