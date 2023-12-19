import React, { useState, useEffect } from "react";
import { GovernorModel } from "../components/GovernorModel";
import styled, { keyframes } from "styled-components";

export const Main = () => {
    const [anim, setAnim] = useState(false);

    useEffect(() => {
        const AnimeTitle = setTimeout(() => {
            setAnim(true);
        }, 1000);

        return () => {
            clearTimeout(AnimeTitle);
            console.log("Компонента размонтирована");
        };
    }, []);

    return (
        <Container>
            <GovernorModel />
            <TitleMainBanner animate={anim}>
                Интерактивная онлайн лаборатория
            </TitleMainBanner>
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    height: 100vh;
    position: relative;
`;
const TitleMainBanner = styled.p<{ animate: boolean }>`
    width: max-content;
    height: max-content;
    color: red;
    font-size: ${(props) => (props.animate ? "30px" : "70px")};
    z-index: 2;
    user-select: none;
    position: absolute;
    top: ${(props) => (props.animate ? "60px" : "50%")};
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 1s;
`;
