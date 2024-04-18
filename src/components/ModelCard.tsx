import { Button } from "antd"
import { useEffect, useState } from "react"
import Plot from "react-plotly.js"

const layout = {
  title: "Физическая интерпретация",
  xaxis: { title: "Время" },
  yaxis: { title: "Угол/Скорость" },
}

export const ModelCard = ({ ...props }: any) => {
  const [data, setData] = useState<any>(0)
  const [intervalId, setIntervalId] = useState<any>()
  const [yData, setYData] = useState(() =>
    props.solution?.map((row: any) => row[0])
  )
  const func = () => {
    const id = setInterval(() => {
      setData((prev: any) => prev + 1)
    }, 10)
    setIntervalId(id)
  }

  useEffect(() => {
    setData(0)
    intervalId ? clearInterval(intervalId) : null
    props.play ? func() : null
  }, [props.play])

  return (
    <div>
      <Plot
        style={{
          maxWidth: "500px",
          maxHeight: "450px",
          width: "max-content",
        }}
        data={[
          {
            x: props.tSpan,
            y: props.solution?.map((row: any) => row[0]),
            type: "scatter",
            mode: "lines",
            name: "Угловая скорость",
          },
          {
            type: "scatter",
            mode: "lines",
            x: [data, data],
            y: [Math.min(...yData) - 1, Math.max(...yData) + 1], // Меняйте в зависимости от диапазона оси y на вашем графике
            showlegend: false,
            textinfo: "none",
            name: "Линия",
          },
        ]}
        layout={layout}
      />
      {/* <Button
                onClick={() => {
                    console.log(props.solution?.map((row: any) => row[0]));
                }}
            >
                click
            </Button> */}
    </div>
  )
}
