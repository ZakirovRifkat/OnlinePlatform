import { GovernorModel } from "../components/GovernorModel";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";

export const Content = ({ ...props }: any) => {
    return (
        <AnimatePresence>
            <Container
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
            >
                <GovernorModel
                    colorMap={props.colorMap}
                    displacementMap={props.displacementMap}
                    normalMap={props.normalMap}
                    roughnessMap={props.roughnessMap}
                    isModelLoaded={props.isModelLoaded}
                    setModelLoaded={props.setModelLoaded}
                />
                <TitleMainBanner animate={props.isModelLoaded}>
                    Интерактивная онлайн лаборатория
                </TitleMainBanner>
            </Container>
        </AnimatePresence>
    );
};

const Container = styled(motion.div)`
    width: 100%;
    height: 100vh;
    position: relative;
`;
const TitleMainBanner = styled.p<{ animate: boolean }>`
    width: max-content;
    height: max-content;
    font-size: 70px;
    z-index: 2;
    user-select: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 1s;

    color: #52380a;
    text-transform: uppercase;
    font-weight: 700;
    font-family: var(--font);

    animation-name: ${(props) => (props.animate ? "anime" : "")};
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
    animation-timing-function: linear;
    animation-delay: 1.5s;

    @keyframes anime {
        from {
            top: 50%;
            font-size: 70px;
        }
        to {
            top: 60px;
            font-size: 45px;
        }
    }
`;
