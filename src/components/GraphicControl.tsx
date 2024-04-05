import { motion } from "framer-motion";
import styled from "styled-components";
import { ModelCard } from "./ModelCard";

export const GraphicControl = ({ ...props }: any) => {
    return (
        <Container
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <ModelCard
                tData={props.tData}
                solution={props.solution}
                play={props.play}
            />
        </Container>
    );
};

const Container = styled(motion.div)`
    /* max-width: 500px;
    max-height: 600px; */
    width: 100%;
    height: 100%;
    /* background-color: #ffffff; */
    overflow-y: auto;
    &::-webkit-scrollbar {
        width: 3px;
        background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
        background-color: silver;
    }
`;
