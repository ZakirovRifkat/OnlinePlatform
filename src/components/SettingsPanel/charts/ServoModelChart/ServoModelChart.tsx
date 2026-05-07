import Plot from "react-plotly.js";
import { Button, Flex, Result, Spin, Tabs, TabsProps } from "antd";
import { observer } from "mobx-react-lite";
import {
    useContentUiStore,
    useServoStore,
} from "../../../../store/contentStore";
import {
    SERVO_CHART_LAYOUT_SPEED,
    SERVO_CHART_LAYOUT_SLIDER,
    SERVO_CHART_STYLE,
} from "./constants";
import { useServoPlayback } from "./hooks/useServoPlayback";
import type { ServoModelChartProps } from "./types";
import { Container } from "./styles";

export const ServoModelChart = observer((props: ServoModelChartProps) => {
    const uiStore = useContentUiStore();
    const servoStore = useServoStore();

    const currentTime = useServoPlayback({
        isPlay: uiStore.isPlay,
        playStartedAt: uiStore.playStartedAt,
        loading: props.loading,
        timeData: props.timeData,
    });

    const zRange = servoStore.zRange;
    const yRange = servoStore.yRange;

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
                                key="console"
                                onClick={props.onRetry}
                            >
                                Обновить
                            </Button>,
                        ]}
                    ></Result>
                )}
                {!props.error && <Spin />}
            </Container>
        );
    }

    if (!props.data || !props.data2 || !zRange || !yRange) {
        return (
            <Container>
                <Spin />
            </Container>
        );
    }

    const items: TabsProps["items"] = [
        {
            key: "1",
            label: "Смещение ползунка",
            children: (
                <div style={{ overflow: "auto" }}>
                    <Plot
                        style={SERVO_CHART_STYLE}
                        data={[
                            props.data,
                            {
                                type: "scatter",
                                mode: "lines",
                                x: [currentTime, currentTime],
                                y: [zRange.min * 1.1, zRange.max * 1.1],
                                showlegend: false,
                                textinfo: "none",
                                name: "Линия",
                            },
                        ]}
                        layout={SERVO_CHART_LAYOUT_SLIDER}
                    />
                </div>
            ),
        },
        {
            key: "2",
            label: "Угловая скорость",
            children: (
                <div style={{ overflow: "auto" }}>
                    <Plot
                        style={SERVO_CHART_STYLE}
                        data={[
                            props.data2,
                            {
                                type: "scatter",
                                mode: "lines",
                                x: [currentTime, currentTime],
                                y: [yRange.min * 1.1, yRange.max * 1.1],
                                showlegend: false,
                                textinfo: "none",
                                name: "Линия",
                            },
                        ]}
                        layout={SERVO_CHART_LAYOUT_SPEED}
                    />
                </div>
            ),
        },
    ];
    return (
        <>
            {!props.loading && (
                <Flex
                    vertical
                    align="center"
                    style={{ background: "white", overflow: "hidden" }}
                    justify="center"
                >
                    <Tabs
                        defaultActiveKey="1"
                        items={items}
                        type="card"
                        style={{ width: "100%" }}
                    />
                </Flex>
            )}
        </>
    );
});
