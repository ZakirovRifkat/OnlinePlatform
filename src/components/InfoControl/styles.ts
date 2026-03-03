import { motion } from "framer-motion";
import styled from "styled-components";

export const Container = styled(motion.div)`
    max-width: 500px;
    max-height: 600px;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    padding: 20px 10px;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 3px;
        background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background-color: silver;
    }

    @media screen and (max-width: 1550px) {
        max-height: 430px;
        max-width: 450px;
    }

    @media screen and (max-width: 1200px) {
        max-height: 400px;
        max-width: 350px;
    }
`;
