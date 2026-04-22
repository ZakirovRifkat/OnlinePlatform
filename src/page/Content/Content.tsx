import { useMemo, useState } from "react";
import { GovernorModel } from "../../components/GovernorModel";
import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react-lite";
import logo from "../assets/logo.svg";
import { ControlPanel } from "../../components/ControlPanel";
import { SettingsPanel } from "../../components/SettingsPanel";
import { Container, Footer, Icon, TitleMainBanner } from "./styles";
import type { ContentProps } from "./types";
import { useGovernorSolution } from "./hooks/useGovernorSolution";
import {
    CONTENT_TRANSITION,
    FOOTER_AUTHOR,
    FOOTER_DEPARTMENT,
    SYSTEM_PARAMS,
    T_SPAN_DIVIDER,
    T_SPAN_LENGTH,
} from "./constants";
import {
    ContentStoreContext,
    createContentStore,
    useContentUiStore,
} from "../../store/contentStore";

const ContentView = observer(
    ({
        colorMap,
        displacementMap,
        normalMap,
        roughnessMap,
        isModelLoaded,
        setModelLoaded,
    }: ContentProps) => {
        const uiStore = useContentUiStore();

        // Временные точки для решения
        const tSpan = useMemo(
            () =>
                Array.from(
                    { length: T_SPAN_LENGTH },
                    (_, i) => i / T_SPAN_DIVIDER,
                ),
            [],
        );
        const dt = useMemo(() => tSpan[1] - tSpan[0], [tSpan]);

        const solution = useGovernorSolution({
            initialConditions: uiStore.initialConditions,
            tSpan,
            dt,
            aParams: uiStore.aParams,
            f0Params: uiStore.f0Params,
            mParams: uiStore.mParams,
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
                orbit: uiStore.isOrbit,
                play: uiStore.isPlay,
                solution,
                type: uiStore.type,
            }),
            [
                colorMap,
                displacementMap,
                normalMap,
                roughnessMap,
                isModelLoaded,
                setModelLoaded,
                uiStore.isOrbit,
                uiStore.isPlay,
                solution,
                uiStore.type,
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
                    <Icon $animate={isModelLoaded} alt={"logo"} src={logo} />
                    <TitleMainBanner $animate={isModelLoaded}>
                        Интерактивная онлайн–лаборатория
                    </TitleMainBanner>
                    <ControlPanel />
                    <SettingsPanel tData={tSpan} solution={solution} />

                    <Footer>
                        <span>{FOOTER_DEPARTMENT}</span>
                        <span>{FOOTER_AUTHOR}</span>
                    </Footer>
                </Container>
            </AnimatePresence>
        );
    },
);

export const Content = (props: ContentProps) => {
    const [store] = useState(createContentStore);

    return (
        <ContentStoreContext.Provider value={store}>
            <ContentView {...props} />
        </ContentStoreContext.Provider>
    );
};
