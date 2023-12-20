import React from "react";
import styled from "styled-components";
import { InfoControl } from "./InfoControl";
import { ParamControl } from "./ParamControl";
import { GraphicControl } from "./GraphicControl";
import { AnimatePresence } from "framer-motion";

export const ModalControl = ({ ...props }: any) => {
    return (
        <AnimatePresence>
            <Container>
                {props.controlValue === "info" ? (
                    <InfoControl />
                ) : props.controlValue === "params" ? (
                    <ParamControl />
                ) : props.controlValue === "graphic" ? (
                    <GraphicControl />
                ) : null}
            </Container>
        </AnimatePresence>
    );
};

const Container = styled.div`
    width: max-content;
    height: max-content;
    background-color: white;
    border-radius: 20px;
    position: absolute;
    top: 50%;
    left: 5%;
    transform: translate(0%, -50%);
`;
