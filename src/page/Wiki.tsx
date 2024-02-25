import { styled } from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const Wiki = () => {
    const navigate = useNavigate();

    const pageVariants = {
        initial: {
            opacity: 0,
            scale: 0,
        },
        enter: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeInOut",
            },
        },
        exit: {
            opacity: 0,
            scale: 0,
            transition: {
                duration: 0.2,
                ease: "easeInOut",
            },
        },
    };
    return (
        <Container
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => {
                navigate("/main");
            }}
        >
            <ContentContainer
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                dsdss
            </ContentContainer>
        </Container>
    );
};

const Container = styled(motion.div)`
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: #0000009e;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    overflow-x: scroll;
    padding: 2vw 0;
    @media (max-width: 620px) {
        padding: 0px;
    }
`;

const ContentContainer = styled(motion.div)`
    background-color: #383838;
    border-radius: 20px;
    margin: auto auto;
    padding: 45px 55px;

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

const TitleMainBanner = styled.p`
    width: max-content;
    height: max-content;
    z-index: 2;
    user-select: none;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 1s;
    color: #52380a;
    text-transform: uppercase;
    font-weight: 700;
    font-family: var(--font);
    top: 60px;
    font-size: 45px;
`;
const Icon = styled.img`
    width: 100px;
    height: 100px;
    position: absolute;
    top: 60px;
    left: 6%;
    transform: translate(-50%, -50%);
    opacity: 1;
`;
const Footer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    position: absolute;
    padding: 0 1em;
    bottom: 0.6em;
    left: 0;
    font-family: var(--font);
    color: #00000073;
    font-size: 20px;
`;
