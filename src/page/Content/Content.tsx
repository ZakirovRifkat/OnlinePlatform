import { useCallback, useEffect, useMemo, useState } from "react";
import { GovernorModel } from "../../components/GovernorModel";
import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react-lite";
import { notification } from "antd";
import logo from "../assets/logo.svg";
import { ControlPanel } from "../../components/ControlPanel";
import { SettingsPanel } from "../../components/SettingsPanel";
import {
    Container,
    Footer,
    Icon,
    ModelTab,
    ModelTabsContainer,
    TitleMainBanner,
} from "./styles";
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
    useServoStore,
} from "../../store/contentStore";
import { useServoModelData } from "../../components/SettingsPanel/charts/ServoModelChart/hooks/useServoModelData";

const parseInitialValues = (value: string) => {
    const parsed = value
        .split(";")
        .map((item) => Number(item.trim()))
        .filter((item) => Number.isFinite(item));

    if (parsed.length === 4) {
        return parsed;
    }

    return [0, 0, -0.65, 0];
};

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
        const servoStore = useServoStore();

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

        const { solution, tData, loading, error, refetch } =
            useGovernorSolution({
                initialConditions: uiStore.initialConditions,
                tSpan,
                dt,
                aParams: uiStore.aParams,
                f0Params: uiStore.f0Params,
                mParams: uiStore.mParams,
                systemParams: SYSTEM_PARAMS,
            });

        const getServoRequestParams = useCallback(
            () => ({
                A: servoStore.servoA,
                B: servoStore.servoB,
                C: servoStore.servoC,
                delta: servoStore.servoDelta,
                initial: parseInitialValues(servoStore.servoInitial),
            }),
            [
                servoStore.servoA,
                servoStore.servoB,
                servoStore.servoC,
                servoStore.servoDelta,
                servoStore.servoInitial,
            ],
        );

        const {
            data: servoData,
            data2: servoData2,
            error: servoError,
            loading: servoLoading,
            refetch: refetchServo,
            timeData: servoTimeData,
        } = useServoModelData({
            getRequestParams: getServoRequestParams,
            setServoSeries: servoStore.setServoSeries,
        });

        useEffect(() => {
            if (error) {
                notification.error({
                    message: "Ошибка классической модели",
                    description:
                        typeof error === "string"
                            ? error
                            : JSON.stringify(error),
                    placement: "topRight",
                });
            }
        }, [error]);

        useEffect(() => {
            if (servoError) {
                notification.error({
                    message: "Ошибка сервомодели",
                    description:
                        typeof servoError === "string"
                            ? servoError
                            : JSON.stringify(servoError),
                    placement: "topRight",
                });
            }
        }, [servoError]);

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
                    <ModelTabsContainer>
                        <ModelTab
                            $selected={!uiStore.type}
                            onClick={() => uiStore.setType(false)}
                        >
                            Классическая модель регулятора
                        </ModelTab>
                        <ModelTab
                            $selected={uiStore.type}
                            onClick={() => uiStore.setType(true)}
                        >
                            Модель с сервомотором
                        </ModelTab>
                    </ModelTabsContainer>
                    <ControlPanel />
                    <SettingsPanel
                        tData={tData}
                        solution={solution}
                        classicError={error}
                        classicLoading={loading}
                        onRetryClassic={refetch}
                        servoData={servoData}
                        servoData2={servoData2}
                        servoError={servoError}
                        servoLoading={servoLoading}
                        servoTimeData={servoTimeData}
                        onRetryServo={refetchServo}
                    />

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
