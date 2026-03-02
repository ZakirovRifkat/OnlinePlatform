import { motion } from "framer-motion";
import { styled } from "styled-components";

export const Container = styled(motion.div)`
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: #0000009e;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    overflow-x: hidden;
    padding: 2vw 0;
    font-family: var(--font);
    font-weight: 600;
    @media (max-width: 620px) {
        padding: 0px;
    }
`;

export const ContentContainer = styled(motion.div)`
    background-color: white;
    border-radius: 20px;
    margin: auto auto;
    padding: 30px 55px;
    width: 80%;

    @media (max-width: 620px) {
        padding: 6vw 6vw;
        width: 100%;
        min-height: 100vh;
        height: max-content;
        border-radius: 0px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

export const CodeBlock = styled.div<{ $open: boolean }>`
    height: auto;
    max-height: ${(props) => (props.$open ? "1000px" : 0)};
    transition: max-height
        ${(props) => (props.$open ? " 0.8s ease-in-out" : " 0.5s ease-out")};
    overflow: hidden;
    font-family: "JetBrains Mono", monospace;
    font-weight: 400;
`;

export const ImgContainer = styled.div<{ $back: boolean }>`
    width: max-content;
    height: max-content;
    float: right;
    position: relative;
    padding: 10px;
    border-radius: 20px;
    transition: background-color 0.5s linear;
    background-color: ${(props) => (props.$back ? "#39bdf122" : "transparent")};
`;

export const ShortModal = styled.div<{ $top: string; $left: string }>`
    width: max-content;
    height: max-content;
    padding: 5px 10px;
    position: absolute;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.4);
    top: ${(props) => props.$top};
    left: ${(props) => props.$left};
    opacity: 0;
    font-size: 14px;
    transition: opacity 0.3s;
    &:hover {
        opacity: 1;
    }
`;
