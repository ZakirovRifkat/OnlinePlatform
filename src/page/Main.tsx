import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { Preloader } from "./Preloader";
import { Content } from "./Content";

export const Main = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const AnimeTitle = setTimeout(() => {
            setLoading(false);
        }, 8500);

        return () => {
            clearTimeout(AnimeTitle);
            console.log("Компонента размонтирована");
        };
    }, []);

    return (
        <AnimatePresence>
            <Container>{loading ? <Preloader /> : <Content />}</Container>
        </AnimatePresence>
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
