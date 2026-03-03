import { useEffect, useRef, useState } from "react";
import Plot from "react-plotly.js";
import type { ModelCardProps } from "./types";
import { Container } from "./styles";

const layout = {
    title: "Физическая интерпретация",
    xaxis: { title: "Время" },
    yaxis: { title: "Уголовая корость" },
};

export const ModelCard = (props: ModelCardProps) => {
    const [data, setData] = useState(0);

    const intervalIdRef = useRef<number | null>(null);

    const [yData, setYData] = useState<number[]>(() =>
        props.solution?.map((row) => row[0]),
    );

    const func = () => {
        const id = setInterval(() => {
            setData((prev) => prev + 1);
        }, 10);
        intervalIdRef.current = id;
    };

    useEffect(() => {
        setData(0);
        intervalIdRef.current ? clearInterval(intervalIdRef.current) : null;
        props.play ? func() : null;
    }, [props.play]);

    return (
        <Container>
            <Plot
                style={{
                    maxWidth: "500px",
                    maxHeight: "450px",
                    width: "max-content",
                }}
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
                        x: [data, data],
                        y: [
                            Math.min(...yData) * 1.1 + 0.01,
                            Math.max(...yData) * 1.1,
                        ], // Меняйте в зависимости от диапазона оси y на вашем графике
                        showlegend: false,
                        textinfo: "none",
                        name: "Линия",
                    },
                ]}
                layout={layout}
            />
        </Container>
    );
};
