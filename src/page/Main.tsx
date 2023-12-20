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
        }, 3500);

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
