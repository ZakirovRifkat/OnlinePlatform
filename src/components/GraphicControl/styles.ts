import { motion } from "framer-motion";
import styled from "styled-components";

export const Container = styled(motion.div)`
    width: 100%;
    height: 100%;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 3px;
        background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background-color: silver;
    }

    @media screen and (max-width: 600px) {
        max-width: 350px;
    }
`;
