import Plot from "react-plotly.js";
import { useCallback, useEffect, useState } from "react";
import { Button, Flex, Result, Spin, Tabs, TabsProps } from "antd";
import { fetchModelData } from "../../../../api/modelApi";
import type { ServoModelChartProps } from "./types";
import { Container } from "./styles";

export const ServoModelChart = (props: ServoModelChartProps) => {
    const [A] = useState(() => Number(localStorage.getItem("A")) || 1.5);
    const [B] = useState(() => Number(localStorage.getItem("B")) || 1);
    const [C] = useState(() => Number(localStorage.getItem("C")) || 0);
    const [delta] = useState(
        () => Number(localStorage.getItem("delta")) || 1.3,
    );
    const [initial] = useState(
        () =>
            localStorage.getItem("initial")?.split(";").map(Number) || [
                0, 0, -0.65, 0,
            ],
    );
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

    const [minZ, setMinZ] = useState<number>();
    const [maxZ, setMaxZ] = useState<number>();
    const [minY, setMinY] = useState<number>();
    const [maxY, setMaxY] = useState<number>();
    const [error, setError] = useState<unknown>();
    // const [index, setIndex] = useState<number>(0);

    useEffect(() => {
        let id: number | null = null;
        let index = 0;
        if (!loading && props.play && timeData.length > 0) {
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
    }, [loading, props.play, timeData]);

    const getParams = useCallback(() => {
        setError(undefined);
        fetchModelData({
            A,
            B,
            C,
            delta,
            initial,
        })
            .then((data) => {
                // y[:, 2]
                const xValues = data.y.map((row: number[]) => row[2]);

                // y[:, 0]
                const yValues = data.y.map((row: number[]) => row[3]);

                // y[:, 1]
                const zValues = data.y.map((row: number[]) => row[1]);

                localStorage.setItem("xValues", String(xValues));
                localStorage.setItem("yValues", String(yValues));
                localStorage.setItem("zValues", String(zValues));
                setTimeData(data.t);
                setMinZ(() => Math.min(...zValues));
                setMaxZ(() => Math.max(...zValues));
                setMinY(() => Math.min(...yValues));
                setMaxY(() => Math.max(...yValues));
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
    }, [A, B, C, delta, initial]);

    useEffect(() => {
        getParams();
    }, [getParams, props.play]);

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

    if (
        !data ||
        !data2 ||
        minZ === undefined ||
        maxZ === undefined ||
        minY === undefined ||
        maxY === undefined
    ) {
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
                                y: [minZ! * 1.1, maxZ! * 1.1], // Меняйте в зависимости от диапазона оси y на вашем графике
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
                                y: [minY! * 1.1, maxY! * 1.1], // Меняйте в зависимости от диапазона оси y на вашем графике
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
};
