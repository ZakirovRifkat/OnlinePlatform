import React from "react";
import styled from "styled-components";
import icon from "./assets/governor.svg";

export const Preloader = () => {
    return (
        <Container>
            <Icon image={icon} />
        </Container>
    );
};

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: #515151;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const Icon = styled.div<{ image: string }>`
    width: 100px;
    height: 200px;
    background-image: url(${(props) => props.image});
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
`;
