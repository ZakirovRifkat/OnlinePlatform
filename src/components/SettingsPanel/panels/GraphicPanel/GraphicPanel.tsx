import { ClassicModelChart } from "../../charts/ClassicModelChart";
import { ServoModelChart } from "../../charts/ServoModelChart";
import type { GraphicPanelProps } from "./types";
import { Container } from "./styles";

export const GraphicPanel = (props: GraphicPanelProps) => {
    const type = localStorage.getItem("type") === "true";

    return (
        <Container
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {type && <ServoModelChart play={props.play} />}
            {!type && (
                <ClassicModelChart
                    tSpan={props.tData}
                    solution={props.solution}
                    play={props.play}
                />
            )}
        </Container>
    );
};
