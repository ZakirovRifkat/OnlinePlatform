import Plot from "react-plotly.js";
import { useEffect, useState } from "react";
import numeric from "numeric";
import { Flex, Spin } from "antd";

function sign(x: number): number {
    if (x > 0) {
        return 1;
    } else if (x < 0) {
        return -1;
    } else {
        return 0;
    }
}

export const ArticleModel = () => {
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
    const [initial, setInitial] = useState(
        () =>
            localStorage.getItem("initial")?.split(";").map(Number) || [
                0, 0, 0, 0,
            ]
    );
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        console.log(A);
        console.log(B);
        console.log(C);
        console.log(delta);
        console.log(initial);

        const url = `http://localhost:8000/model?A=${A}&B=${B}&C=${C}&delta=${delta}&initial=${initial.join(
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
                const yValues = data.y.map((row: any[]) => row[0]);

                // y[:, 1]
                const zValues = data.y.map((row: any[]) => row[1]);
                localStorage.setItem("zValues", String(zValues));
                setData([
                    {
                        x: xValues,
                        y: yValues,
                        z: zValues,
                        type: "scatter3d",
                        mode: "lines",
                    },
                ]);
            })
            .catch((error) => {
                console.error("Ошибка:", error);
                // Обработка ошибки
            });
    }, []);

    return (
        <>
            <Plot
                style={{
                    maxWidth: "1000px",
                    maxHeight: "500px",
                    width: "max-content",
                }}
                data={data}
                layout={{
                    orientation: 10,
                    scene: {
                        xaxis: { title: "X" },
                        yaxis: { title: "Y" },
                        zaxis: { title: "Z" },
                    },
                    title: "Модель с сервомотором",
                }}
            ></Plot>
        </>
    );
};
