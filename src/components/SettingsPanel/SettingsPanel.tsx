import { InfoPanel } from "./panels/InfoPanel";
import { ParametersPanel } from "./panels/ParametersPanel";
import { GraphicPanel } from "./panels/GraphicPanel";
import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react-lite";
import { useContentUiStore } from "../../store/contentStore";
import type { SettingsPanelProps } from "./types";
import { Container } from "./styles";

export const SettingsPanel = observer(
    ({
        tData,
        solution,
        classicError,
        classicLoading,
        onRetryClassic,
        servoData,
        servoData2,
        servoError,
        servoLoading,
        servoTimeData,
        onRetryServo,
    }: SettingsPanelProps) => {
        const uiStore = useContentUiStore();

        return (
            <AnimatePresence>
                <Container $shadow={uiStore.controlValue === "params"}>
                    {uiStore.controlValue === "info" ? (
                        <InfoPanel />
                    ) : uiStore.controlValue === "params" ? (
                        <ParametersPanel />
                    ) : uiStore.controlValue === "graphic" ? (
                        <GraphicPanel
                            tData={tData}
                            solution={solution}
                            classicError={classicError}
                            classicLoading={classicLoading}
                            onRetryClassic={onRetryClassic}
                            servoData={servoData}
                            servoData2={servoData2}
                            servoError={servoError}
                            servoLoading={servoLoading}
                            servoTimeData={servoTimeData}
                            onRetryServo={onRetryServo}
                        />
                    ) : null}
                </Container>
            </AnimatePresence>
        );
    },
);
