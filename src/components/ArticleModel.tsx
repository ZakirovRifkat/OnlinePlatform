import Plot from "react-plotly.js";
import { useEffect, useState } from "react";
import { Button, Flex, Result, Spin, Tabs, TabsProps } from "antd";
import { styled } from "styled-components";

export const ArticleModel = ({ ...props }) => {
    // @ts-ignore
    const [A, setA] = useState(() => Number(localStorage.getItem("A")) || 1.5);
    // @ts-ignore
    const [B, setB] = useState(() => Number(localStorage.getItem("B")) || 1);
    // @ts-ignore
    const [C, setC] = useState(() => Number(localStorage.getItem("C")) || 0);
    // @ts-ignore
    const [delta, setDelta] = useState(
        () => Number(localStorage.getItem("delta")) || 1.3
    );
    // @ts-ignore
    const [initial, setInitial] = useState(
        () =>
            localStorage.getItem("initial")?.split(";").map(Number) || [
                0, 0, -0.65, 0,
            ]
    );
    const [data, setData] = useState<any>();
    const [data2, setData2] = useState<any>();
    const [loading, setLoading] = useState(true);
    const [timeData, setTimeData] = useState<any[]>([]);
    const [currentTime, setCurrentTime] = useState<any>(0);

    const [minZ, setMinZ] = useState<number>();
    const [maxZ, setMaxZ] = useState<number>();
    const [minY, setMinY] = useState<number>();
    const [maxY, setMaxY] = useState<number>();
    const [error, setError] = useState<any>();
    // const [index, setIndex] = useState<number>(0);

    let id = 0;
    useEffect(() => {
        let index = 0;
        if (!loading && props.play) {
            id = setInterval(() => {
                setCurrentTime(timeData[index]);
                index++;
            }, 30);
        }
        return () => {
            clearInterval(id);
        };
    }, [props.play]);

    const getParams = () => {
        setError(undefined);
        const BASE_URL = "https://vs4j67qn-8000.euw.devtunnels.ms";

        const url = `${BASE_URL}/model?A=${A}&B=${B}&C=${C}&delta=${delta}&initial=${initial.join(
            "&initial="
        )}`;

        fetch(url, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                // y[:, 2]
                const xValues = data.y.map((row: any[]) => row[2]);

                // y[:, 0]
                const yValues = data.y.map((row: any[]) => row[3]);

                // y[:, 1]
                const zValues = data.y.map((row: any[]) => row[1]);

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
    };

    useEffect(() => {
        getParams();
    }, []);

    if (loading) {
        return (
            <Container>
                {error && (
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

const Container = styled.div`
    width: 500px;
    height: 450px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;

    @media screen and (max-width: 600px) {
        width: 350px;
        height: 450px;
    }
`;
