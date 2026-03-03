import { motion } from "framer-motion";
import { ModelCard } from "../ModelCard";
import { ArticleModel } from "../ArticleModel";
import type { GraphicControlProps } from "./types";
import { Container } from "./styles";

export const GraphicControl = (props: GraphicControlProps) => {
    const type = localStorage.getItem("type") === "true";

    return (
        <Container
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {type && <ArticleModel play={props.play} />}
            {!type && (
                <ModelCard
                    tSpan={props.tData}
                    solution={props.solution}
                    play={props.play}
                />
            )}
        </Container>
    );
};
