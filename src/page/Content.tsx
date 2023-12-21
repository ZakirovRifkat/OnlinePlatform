import { useState } from "react";
import { GovernorModel } from "../components/GovernorModel";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import logo from "./assets/logo.svg";
import { ControlPanel } from "../components/ControlPanel";
import { ModalControl } from "../components/ModalControl";
import { ConfigProvider } from "antd";

export const Content = ({ ...props }: any) => {
    const [isPlay, setIsPlay] = useState(false);
    const [controlValue, setControl] = useState<null | string>(null);
    const [isOrbit, setOrbit] = useState(false);

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
                    orbit={isOrbit}
                    play={isPlay}
                />
                <Icon animate={props.isModelLoaded} alt={"logo"} src={logo} />
                <TitleMainBanner animate={props.isModelLoaded}>
                    Интерактивная онлайн–лаборатория
                </TitleMainBanner>

                <ControlPanel
                    controlValue={controlValue}
                    setControl={setControl}
                    isOrbit={isOrbit}
                    setOrbit={setOrbit}
                    setPlay={setIsPlay}
                    play={isPlay}
                />
                <ConfigProvider
                    theme={{
                        token: {
                            fontFamily: `"Cormorant Garamond", serif`,
                        },
                    }}
                >
                    <ModalControl controlValue={controlValue} />
                </ConfigProvider>
                <Footer>
                    <span>
                        СПБГУ. Математико-механический факультет. Кафедра
                        прикладной кибернетики.
                    </span>
                    <span>Закиров Р.Э</span>
                </Footer>
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
const Icon = styled.img<{ animate: boolean }>`
    width: 100px;
    height: 100px;
    opacity: 0;
    position: absolute;
    top: 60px;
    left: 6%;
    transform: translate(-50%, -50%);
    animation-name: ${(props) => (props.animate ? "animeIcon" : "")};
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
    animation-timing-function: linear;
    animation-delay: 2s;

    @keyframes animeIcon {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
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
