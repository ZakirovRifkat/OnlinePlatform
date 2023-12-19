import React, { useEffect, useState } from "react";
import styled from "styled-components";
import icon from "./assets/Subtract.svg";

export const Preloader = () => {
    const [loading, setLoading] = useState(100);

    return (
        <Container>
            <ContainerIcon>
                <Zaslon height={`${loading}%`}>
                    <Icon image={icon} />
                </Zaslon>
            </ContainerIcon>
        </Container>
    );
};

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: #838e9e;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const Icon = styled.div<{ image: string }>`
    width: 130px;
    height: 155px;
    background-image: url(${(props) => props.image});
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    flex-shrink: 0;
`;
const ContainerIcon = styled.div`
    width: 130px;
    height: 153px;
    background-color: #ffffff;
    position: relative;
`;
const Zaslon = styled.div<{ height: string }>`
    width: 130px;
    height: 100%;
    position: absolute;
    background-color: #42526b;
    top: 0;
    animation-name: identifier;
    animation-duration: 8s;
    animation-fill-mode: forwards;
    animation-timing-function: linear;
    transition: all 1s;

    @keyframes identifier {
        from {
            height: 100%;
        }
        to {
            height: 0%;
        }
    }
`;
