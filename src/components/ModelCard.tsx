import Plot from "react-plotly.js";

const layout = {
    title: "Динамика Регулятора Уатта",
    xaxis: { title: "Время" },
    yaxis: { title: "Угол/Скорость" },
};

export const ModelCard = ({ ...props }: any) => {
    return (
        <Plot
            style={{ maxWidth: "500px", maxHeight: "450px" }}
            data={[
                {
                    x: props.tSpan,
                    y: props.solution?.map((row: any) => row[0]),
                    type: "scatter",
                    mode: "lines",
                    name: "Угловая скорость",
                },
                {
                    x: props.tSpan,
                    y: props.solution?.map((row: any) => row[2]),
                    type: "scatter",
                    mode: "lines",
                    name: "Угловое ускорение",
                },
            ]}
            layout={layout}
        />
    );
};
