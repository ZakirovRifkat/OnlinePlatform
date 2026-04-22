import Plot from "react-plotly.js";
import { useCallback, useEffect, useState } from "react";
import { Button, Flex, Result, Spin, Tabs, TabsProps } from "antd";
import { observer } from "mobx-react-lite";
import { fetchModelData } from "../../../../api/modelApi";
import {
    useContentUiStore,
    useServoStore,
} from "../../../../store/contentStore";
import { Container } from "./styles";

export const ServoModelChart = observer(() => {
    const uiStore = useContentUiStore();
    const servoStore = useServoStore();

    const [data, setData] = useState<{
        x: number[];
        y: number[];
        mode: string;
        showlegend: boolean;
        name: string;
    }>();
    const [data2, setData2] = useState<{
        x: number[];
        y: number[];
        mode: string;
        showlegend: boolean;
        name: string;
    }>();
    const [loading, setLoading] = useState(true);
    const [timeData, setTimeData] = useState<number[]>([]);
    const [currentTime, setCurrentTime] = useState(0);

    const [error, setError] = useState<unknown>();
    // const [index, setIndex] = useState<number>(0);

    useEffect(() => {
        let id: number | null = null;
        let index = 0;
        if (!loading && uiStore.isPlay && timeData.length > 0) {
            id = setInterval(() => {
                if (index >= timeData.length) {
                    if (id) {
                        clearInterval(id);
                    }
                    return;
                }
                setCurrentTime(timeData[index]);
                index++;
            }, 30);
        }
        return () => {
            if (id) {
                clearInterval(id);
            }
        };
    }, [loading, uiStore.isPlay, timeData]);

    const getParams = useCallback(() => {
        setError(undefined);
        fetchModelData(servoStore.requestParams)
            .then((data) => {
                // y[:, 2]
                const xValues = data.y.map((row: number[]) => row[2]);

                // y[:, 0]
                const yValues = data.y.map((row: number[]) => row[3]);

                // y[:, 1]
                const zValues = data.y.map((row: number[]) => row[1]);

                servoStore.setServoSeries(xValues, yValues, zValues);
                setTimeData(data.t);
                setData({
                    x: data.t,
                    y: zValues,
                    mode: "lines",
                    showlegend: false,
                    name: "Смещение ползунка",
                });
                setData2({
                    x: data.t,
                    y: yValues,
                    mode: "lines",
                    showlegend: false,
                    name: "Изменение угловой скорости",
                });
                setLoading(false);
            })
            .catch((error) => {
                console.error("Ошибка:", error);
                setError(error);
                // Обработка ошибки
            });
    }, [
        servoStore,
        servoStore.servoA,
        servoStore.servoB,
        servoStore.servoC,
        servoStore.servoDelta,
        servoStore.servoInitial,
    ]);

    useEffect(() => {
        getParams();
    }, [getParams, uiStore.isPlay]);

    const zRange = servoStore.zRange;
    const yRange = servoStore.yRange;

    if (loading) {
        return (
            <Container>
                {Boolean(error) && (
                    <Result
                        status="error"
                        title="Ошибка запроса"
                        subTitle="Повторите запрос или поменяйте параметры"
                        extra={[
                            <Button
                                type="primary"
                                key="console"
                                onClick={getParams}
                            >
                                Обновить
                            </Button>,
                        ]}
                    ></Result>
                )}
                {!error && <Spin />}
            </Container>
        );
    }

    if (!data || !data2 || !zRange || !yRange) {
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
                        style={{
                            maxWidth: "500px",
                            maxHeight: "450px",
                            width: "max-content",
                        }}
                        data={[
                            data,
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
                        layout={{
                            orientation: 10,
                            xaxis: { title: "Время" },
                            yaxis: { title: "Смещение ползунка" },
                            title: "Модель с сервомотором",
                        }}
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
                        style={{
                            maxWidth: "500px",
                            maxHeight: "450px",
                            width: "max-content",
                            overflowX: "auto",
                        }}
                        data={[
                            data2,
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
                        layout={{
                            orientation: 10,
                            xaxis: { title: "Время" },
                            yaxis: { title: "Изменение угловой скорости" },
                            title: "Модель с сервомотором",
                        }}
                    />
                </div>
            ),
        },
    ];
    return (
        <>
            {!loading && (
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
