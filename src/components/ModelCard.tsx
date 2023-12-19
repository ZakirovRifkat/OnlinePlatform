import styled from "styled-components";
import Plot from "react-plotly.js";
import { useEffect, useState } from "react";
import { GovernorModel } from "./GovernorModel";

function governor_equation(
    y: any[],
    t: number,
    I: number,
    c: number,
    m: number,
    g: number,
    R: number,
    r: number,
    L: number
) {
    const theta = y[0];
    const omega = y[1];
    const dydt = [
        omega,
        (m * g * R * Math.sin(theta) - c * omega - m * g * r) / I,
    ];
    return dydt;
}

function rungeKutta(
    y: number[],
    t: number,
    h: number,
    I: number,
    c: number,
    m: number,
    g: number,
    R: number,
    r: number,
    L: number
) {
    const k1 = governor_equation(y, t, I, c, m, g, R, r, L);
    const k2 = governor_equation(
        [y[0] + (k1[0] * h) / 2, y[1] + (k1[1] * h) / 2],
        t + h / 2,
        I,
        c,
        m,
        g,
        R,
        r,
        L
    );
    const k3 = governor_equation(
        [y[0] + (k2[0] * h) / 2, y[1] + (k2[1] * h) / 2],
        t + h / 2,
        I,
        c,
        m,
        g,
        R,
        r,
        L
    );
    const k4 = governor_equation(
        [y[0] + k3[0] * h, y[1] + k3[1] * h],
        t + h,
        I,
        c,
        m,
        g,
        R,
        r,
        L
    );

    const newY = [
        y[0] + ((k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]) * h) / 6,
        y[1] + ((k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]) * h) / 6,
    ];

    return newY;
}

function simulateGovernor(
    I: number,
    c: number,
    m: number,
    g: number,
    R: number,
    r: number,
    L: number,
    theta0: number,
    omega0: number,
    totalTime: number,
    timeStep: number
) {
    const numSteps = Math.floor(totalTime / timeStep) + 1;
    const t = new Array(numSteps);
    const solution = new Array(numSteps);

    t[0] = 0;
    solution[0] = [theta0, omega0];

    for (let i = 1; i < numSteps; i++) {
        t[i] = t[i - 1] + timeStep;
        solution[i] = rungeKutta(
            solution[i - 1],
            t[i - 1],
            timeStep,
            I,
            c,
            m,
            g,
            R,
            r,
            L
        );
    }

    return { t, solution };
}

// Parameters
const I = 1.0; // moment of inertia
const c = 0.1; // damping coefficient
const m = 1.0; // mass of one rotating mass
const g = 9.8; // acceleration due to gravity
const R = 1.0; // length of the arms
const r = 0.5; // distance from the axis of rotation to the center of mass
const L = 1.0; // distance from the pivot point to the center of mass

// Initial conditions
const theta0 = 0.1; // initial angle

// Simulation settings
const totalTime = 10.0;
const timeStep = 0.1;

const layout = {
    title: "Centrifugal Governor Simulation",
    xaxis: { title: "Time" },
    yaxis: { title: "Angle/Velocity" },
};

export const ModelCard = ({ omega }: { omega: number }) => {
    const [a, setA] = useState<{ t: any[]; solution: any[] }>({
        t: [0],
        solution: [],
    });

    useEffect(() => {
        console.log(omega);

        setA(
            simulateGovernor(
                I,
                c,
                m,
                g,
                R,
                r,
                L,
                theta0,
                omega,
                totalTime,
                timeStep
            )
        );
    }, [omega]);
    return (
        <Card>
            <GovernorModel />
            <Plot
                data={[
                    {
                        type: "scatter",
                        mode: "lines",
                        name: "Theta(t)",
                        x: a.t,
                        y: a.solution.map((point) => point[0]),
                    },
                    {
                        type: "scatter",
                        mode: "lines",
                        name: "Omega(t)",
                        x: a.t,
                        y: a.solution.map((point) => point[1]),
                    },
                ]}
                layout={layout}
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
    display: grid;
    grid-template-rows: repeat(2, 1fr);
`;
