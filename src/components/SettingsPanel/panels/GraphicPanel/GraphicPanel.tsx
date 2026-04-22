import { ClassicModelChart } from "../../charts/ClassicModelChart";
import { ServoModelChart } from "../../charts/ServoModelChart";
import { observer } from "mobx-react-lite";
import { useContentUiStore } from "../../../../store/contentStore";
import type { GraphicPanelProps } from "./types";
import { Container } from "./styles";

export const GraphicPanel = observer((props: GraphicPanelProps) => {
    const uiStore = useContentUiStore();

    return (
        <Container
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {uiStore.type && <ServoModelChart />}
            {!uiStore.type && (
                <ClassicModelChart
                    tSpan={props.tData}
                    solution={props.solution}
                    play={uiStore.isPlay}
                />
            )}
        </Container>
    );
});
