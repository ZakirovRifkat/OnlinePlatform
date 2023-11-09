import styled from "styled-components";
import Plot from "react-plotly.js";

export const ModelCard = () => {
    return (
        <Card>
            <Plot
                data={[
                    {
                        x: [1, 2, 3, 4],
                        y: [10, 15, 13, 17],
                        mode: "markers",
                        type: "scatter",
                    },
                    {
                        x: [2, 3, 4, 5],
                        y: [16, 5, 11, 9],
                        mode: "lines",
                        type: "scatter",
                    },
                    {
                        x: [1, 2, 3, 4],
                        y: [12, 9, 15, 12],
                        mode: "lines+markers",
                        type: "scatter",
                    },
                ]}
                layout={{ title: "A Fancy Plot" }}
            />
        </Card>
    );
};
const Card = styled.div`
    width: 100%;
    min-height: fit-content;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 0px 50px 6px rgba(0, 0, 0, 0.1);
`;
