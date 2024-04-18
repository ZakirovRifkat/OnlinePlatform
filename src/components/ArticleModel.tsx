import Plot from "react-plotly.js"
import { useEffect, useState } from "react"
import { styled } from "styled-components"
import numeric from "numeric"

function sign(x: number): number {
  if (x > 0) {
    return 1
  } else if (x < 0) {
    return -1
  } else {
    return 0
  }
}

export const ArticleModel = () => {
  const [A, setA] = useState(() => Number(localStorage.getItem("A")) || 1.5)
  const [B, setB] = useState(() => Number(localStorage.getItem("B")) || 1)
  const [C, setC] = useState(() => Number(localStorage.getItem("C")) || 0)
  const [delta, setDelta] = useState(
    () => Number(localStorage.getItem("delta")) || 0.5
  )
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    console.log(A)
    console.log(B)
    console.log(C)
    console.log(delta)

    function diff_eq_system(
      t: number,
      state: number[],
      approx = false
    ): number[] {
      let x = state[0]
      let dx = state[1]
      let y = state[2]
      let dy = state[3]
      let z = state[4]
      let ddx

      if (approx) {
        ddx = y - Math.atan(100000 * x) / Math.PI - B * dx - A * x
      } else {
        ddx = y - sign(x) / 2 - B * dx - A * x
      }

      let ddy = -C * y - z
      let ddz = x - delta * z
      return [dx, ddx, dy, ddy, ddz]
    }

    function rk4_step(
      t: number,
      state: number[],
      dt: number,
      f: (t: number, state: number[], approx?: boolean) => number[]
    ): number[] {
      const k1 = numeric.mul(dt, f(t, state))
      const k2 = numeric.mul(
        dt,
        f(t + 0.5 * dt, numeric.add(state, numeric.mul(0.5, k1)))
      )
      const k3 = numeric.mul(
        dt,
        f(t + 0.5 * dt, numeric.add(state, numeric.mul(0.5, k2)))
      )
      const k4 = numeric.mul(dt, f(t + dt, numeric.add(state, k3)))
      const sum = numeric.add(
        k1,
        numeric.add(numeric.mul(2, k2), numeric.add(numeric.mul(2, k3), k4))
      )
      return numeric.add(state, numeric.div(sum, 6.0))
    }

    const tFinal = 50
    const dt = 0.01
    const numSteps = Math.floor(tFinal / dt)

    let t0 = 0
    const x0 = 0.1
    const dx0 = 0.1
    const y0 = 0.1
    const dy0 = 0.1
    const z0 = 0
    let state = [x0, dx0, y0, dy0, z0]

    let xValues: number[] = []
    let yValues: number[] = []
    let zValues: number[] = []

    for (let i = 0; i < numSteps; i++) {
      state = rk4_step(t0, state, dt, diff_eq_system)
      t0 += dt
      xValues.push(state[0])
      yValues.push(state[2])
      zValues.push(state[4])
    }

    setData([
      { x: xValues, y: yValues, z: zValues, type: "scatter3d", mode: "lines" },
    ])
  }, [])

  return (
    <Plot
      style={{
        maxWidth: "1000px",
        maxHeight: "500px",
        width: "max-content",
      }}
      data={data}
      layout={{
        scene: {
          xaxis: { title: "X" },
          yaxis: { title: "Y" },
          zaxis: { title: "Z" },
        },
        title: "Точная система",
      }}
    ></Plot>
  )
}

