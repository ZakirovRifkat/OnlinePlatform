import icon from "../assets/Subtract.svg";
import { AnimatePresence } from "framer-motion";
import { Container, ContainerIcon, Icon, Zaslon } from "./styles";
import type { PreloaderProps } from "./types";
import { PRELOADER_ANIMATION, PRELOADER_TRANSITION } from "./constants";

export const Preloader = ({ isModelLoaded }: PreloaderProps) => {
    return (
        <AnimatePresence>
            {isModelLoaded ? null : (
                <Container
                    initial={PRELOADER_ANIMATION.initial}
                    exit={PRELOADER_ANIMATION.exit}
                    transition={PRELOADER_TRANSITION}
                >
                    <ContainerIcon>
                        <Icon $image={icon} />
                        <Zaslon />
                    </ContainerIcon>
                </Container>
            )}
        </AnimatePresence>
    );
};
