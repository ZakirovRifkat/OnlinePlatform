import { useMemo, useState } from "react";
import { GovernorModel } from "../../components/GovernorModel";
import { AnimatePresence } from "framer-motion";
import logo from "../assets/logo.svg";
import { ControlPanel } from "../../components/ControlPanel";
import { ModalControl } from "../../components/ModalControl";
import { Container, Footer, Icon, TitleMainBanner } from "./styles";
import type { ContentProps, GovernorState } from "./types";
import { useGovernorSolution } from "./hooks/useGovernorSolution";
import { useContentUiState } from "./hooks/useContentUiState";
import {
    CONTENT_TRANSITION,
    FOOTER_AUTHOR,
    FOOTER_DEPARTMENT,
    INITIAL_CONDITIONS,
    SYSTEM_PARAMS,
    T_SPAN_DIVIDER,
    T_SPAN_LENGTH,
} from "./constants";

export const Content = ({
    colorMap,
    displacementMap,
    normalMap,
    roughnessMap,
    isModelLoaded,
    setModelLoaded,
}: ContentProps) => {
    const {
        isPlay,
        setIsPlay,
        controlValue,
        setControl,
        isOrbit,
        setOrbit,
        type,
        setType,
    } = useContentUiState();

    // Начальные условия
    const [initialConditions, setInitialConditions] =
        useState<GovernorState>(INITIAL_CONDITIONS); // Угловая скорость, положение вентиля, угловое ускорение

    const [aParams, setAParams] = useState(0.1);
    const [f0Params, setF0Params] = useState(0.0);
    const [mParams, setMParams] = useState(1.0);

    // Временные точки для решения
    const tSpan = useMemo(
        () =>
            Array.from({ length: T_SPAN_LENGTH }, (_, i) => i / T_SPAN_DIVIDER),
        [],
    );
    const dt = useMemo(() => tSpan[1] - tSpan[0], [tSpan]);

    const solution = useGovernorSolution({
        initialConditions,
        tSpan,
        dt,
        aParams,
        f0Params,
        mParams,
        systemParams: SYSTEM_PARAMS,
    });

    const governorModelProps = useMemo(
        () => ({
            colorMap,
            displacementMap,
            normalMap,
            roughnessMap,
            isModelLoaded,
            setModelLoaded,
            orbit: isOrbit,
            play: isPlay,
            solution,
            type,
        }),
        [
            colorMap,
            displacementMap,
            normalMap,
            roughnessMap,
            isModelLoaded,
            setModelLoaded,
            isOrbit,
            isPlay,
            solution,
            type,
        ],
    );

    const modalProps = useMemo(
        () => ({
            controlValue,
            tData: tSpan,
            solution,
            setPlay: setIsPlay,
            setAParams,
            setF0Params,
            setMParams,
            aParams,
            f0Params,
            mParams,
            initialConditions,
            setInitialConditins: setInitialConditions,
            play: isPlay,
            setType,
            type,
        }),
        [
            controlValue,
            tSpan,
            solution,
            setIsPlay,
            setAParams,
            setF0Params,
            setMParams,
            aParams,
            f0Params,
            mParams,
            initialConditions,
            setInitialConditions,
            isPlay,
            setType,
            type,
        ],
    );

    return (
        <AnimatePresence>
            <Container
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={CONTENT_TRANSITION}
            >
                <GovernorModel {...governorModelProps} />
                <Icon animate={isModelLoaded} alt={"logo"} src={logo} />
                <TitleMainBanner animate={isModelLoaded}>
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
                <ModalControl {...modalProps} />

                <Footer>
                    <span>{FOOTER_DEPARTMENT}</span>
                    <span>{FOOTER_AUTHOR}</span>
                </Footer>
            </Container>
        </AnimatePresence>
    );
};
