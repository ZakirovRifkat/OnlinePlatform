import { motion } from "framer-motion";
import styled from "styled-components";

export const Container = styled(motion.div)`
    display: flex;
    width: 100vw;
    height: 100vh;
    background-color: #838e9e;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    z-index: 999;
`;

export const Icon = styled.div<{ $image: string }>`
    width: 160px;
    height: 183px;
    background-image: url(${(props) => props.$image});
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    flex-shrink: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
`;

export const ContainerIcon = styled.div`
    width: 140px;
    height: 163px;
    background-color: #ffffff;
    position: relative;
    margin: auto;
`;

export const Zaslon = styled.div`
    width: 140px;
    height: 163px;
    position: absolute;
    background-color: #42526b;
    z-index: 1;
    top: 0;
    transition: all 1s;
    animation: identifier 1.5s linear infinite alternate;
    @keyframes identifier {
        from {
            height: 100%;
        }
        to {
            height: 0%;
        }
    }
`;
