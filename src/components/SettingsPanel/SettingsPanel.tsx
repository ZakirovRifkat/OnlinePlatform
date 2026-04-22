import { InfoPanel } from "./panels/InfoPanel";
import { ParametersPanel } from "./panels/ParametersPanel";
import { GraphicPanel } from "./panels/GraphicPanel";
import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react-lite";
import { useContentUiStore } from "../../store/contentStore";
import type { SettingsPanelProps } from "./types";
import { Container } from "./styles";

export const SettingsPanel = observer(
    ({ tData, solution }: SettingsPanelProps) => {
        const uiStore = useContentUiStore();

        return (
            <AnimatePresence>
                <Container $shadow={uiStore.controlValue === "params"}>
                    {uiStore.controlValue === "info" ? (
                        <InfoPanel />
                    ) : uiStore.controlValue === "params" ? (
                        <ParametersPanel />
                    ) : uiStore.controlValue === "graphic" ? (
                        <GraphicPanel tData={tData} solution={solution} />
                    ) : null}
                </Container>
            </AnimatePresence>
        );
    },
);
