import { motion } from "framer-motion";
import styled from "styled-components";

export const Container = styled(motion.div)`
    width: 100%;
    height: 100svh;
    position: relative;
`;

export const TitleMainBanner = styled.p<{ $animate: boolean }>`
    width: max-content;
    height: max-content;
    z-index: 2;
    user-select: none;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 1s;
    opacity: 0;
    color: #52380a;
    text-transform: uppercase;
    font-weight: 700;
    font-family: var(--font);
    top: 60px;
    font-size: 45px;
    animation-name: ${(props) => (props.$animate ? "anime" : "")};
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
    animation-timing-function: linear;
    animation-delay: 1s;

    @media screen and (max-width: 600px) {
        font-size: 28px;
        white-space: wrap;
        width: 100%;
        text-align: center;
    }

    @keyframes anime {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    br {
        display: none;
        @media screen and (max-width: 600px) {
            display: block;
        }
    }
`;

export const Icon = styled.img<{ $animate: boolean }>`
    width: 100px;
    height: 100px;
    opacity: 0;
    position: absolute;
    top: 60px;
    left: 6%;
    transform: translate(-50%, -50%);
    animation-name: ${(props) => (props.$animate ? "animeIcon" : "")};
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
    animation-timing-function: linear;
    animation-delay: 1s;

    @media screen and (max-width: 600px) {
        display: none;
    }

    @keyframes animeIcon {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;

export const Footer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    position: absolute;
    padding: 0 1em;
    bottom: 0.6em;
    left: 0;
    font-family: var(--font);
    color: rgba(0, 0, 0, 0.7);
    font-size: 20px;
    @media screen and (max-width: 600px) {
        display: none;
    }
`;
