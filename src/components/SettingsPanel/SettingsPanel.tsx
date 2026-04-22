import { InfoPanel } from "./panels/InfoPanel";
import { ParametersPanel } from "./panels/ParametersPanel";
import { GraphicPanel } from "./panels/GraphicPanel";
import { AnimatePresence } from "framer-motion";
import type { SettingsPanelProps } from "./types";
import { Container } from "./styles";

export const SettingsPanel = (props: SettingsPanelProps) => {
    return (
        <AnimatePresence>
            <Container $shadow={props.controlValue === "params"}>
                {props.controlValue === "info" ? (
                    <InfoPanel />
                ) : props.controlValue === "params" ? (
                    <ParametersPanel
                        setPlay={props.setPlay}
                        setAParams={props.setAParams}
                        setF0Params={props.setF0Params}
                        setMParams={props.setMParams}
                        aParams={props.aParams}
                        f0Params={props.f0Params}
                        mParams={props.mParams}
                        initialConditions={props.initialConditions}
                        setInitialConditins={props.setInitialConditins}
                        type={props.type}
                        setType={props.setType}
                    />
                ) : props.controlValue === "graphic" ? (
                    <GraphicPanel
                        tData={props.tData}
                        solution={props.solution}
                        play={props.play}
                    />
                ) : null}
            </Container>
        </AnimatePresence>
    );
};
