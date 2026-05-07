import Plot from "react-plotly.js";
import { Button, Result, Spin } from "antd";
import type { ClassicModelChartProps } from "./types";
import { CLASSIC_CHART_LAYOUT, CLASSIC_CHART_STYLE } from "./constants";
import { useClassicModelPlayback } from "./hooks/useClassicModelPlayback";
import { Container } from "./styles";

export const ClassicModelChart = (props: ClassicModelChartProps) => {
    const { currentTime, maxY, minY, yData } = useClassicModelPlayback({
        play: props.play,
        playStartedAt: props.playStartedAt,
        solution: props.solution,
        tSpan: props.tSpan,
    });

    if (props.loading) {
        return (
            <Container>
                {Boolean(props.error) && (
                    <Result
                        status="error"
                        title="Ошибка запроса"
                        subTitle="Повторите запрос или поменяйте параметры"
                        extra={[
                            <Button
                                type="primary"
                                key="classic-retry"
                                onClick={props.onRetry}
                            >
                                Обновить
                            </Button>,
                        ]}
                    />
                )}
                {!props.error && <Spin />}
            </Container>
        );
    }

    if (yData.length === 0) {
        return <Container>Подготовка данных...</Container>;
    }

    return (
        <Container>
            <Plot
                style={CLASSIC_CHART_STYLE}
                data={[
                    {
                        x: props.tSpan,
                        y: props.solution?.map((row) => row[0]),
                        type: "scatter",
                        mode: "lines",
                        name: "Угловая скорость",
                        showlegend: false,
                    },
                    {
                        type: "scatter",
                        mode: "lines",
                        x: [currentTime, currentTime],
                        y: [minY * 1.1 + 0.01, maxY * 1.1],
                        showlegend: false,
                        textinfo: "none",
                        name: "Линия",
                    },
                ]}
                layout={CLASSIC_CHART_LAYOUT}
            />
        </Container>
    );
};
