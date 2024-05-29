import styled from "styled-components";
import { InfoControl } from "./InfoControl";
import { ParamControl } from "./ParamControl";
import { GraphicControl } from "./GraphicControl";
import { AnimatePresence } from "framer-motion";

export const ModalControl = ({ ...props }: any) => {
    return (
        <AnimatePresence>
            <Container $shadow={props.controlValue === "params"}>
                {props.controlValue === "info" ? (
                    <InfoControl />
                ) : props.controlValue === "params" ? (
                    <ParamControl
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
                    <GraphicControl
                        tData={props.tData}
                        solution={props.solution}
                        play={props.play}
                    />
                ) : null}
            </Container>
        </AnimatePresence>
    );
};

const Container = styled.div<{ $shadow?: boolean }>`
    width: max-content;
    height: max-content;

    box-shadow: ${(props) =>
        props.$shadow ? "" : "0px 0px 8px 2px rgba(0, 0, 0, 0.2)"};
    border-radius: 20px;
    overflow: hidden;
    position: absolute;
    top: 50%;
    left: 5%;
    transform: translate(0%, -50%);
`;
