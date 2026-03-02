import type { GovernorState } from "./types";

type GovernorDerivative = (
    variables: GovernorState,
    t: number,
    ...params: number[]
) => GovernorState;

export const wattGovernor: GovernorDerivative = (
    variables,
    _t,
    a,
    b,
    F0,
    m,
    J,
    beta,
    r,
    gamma0,
    x0,
) => {
    const [omega, y, z] = variables;

    return [
        y,
        z,
        -a * z -
            b * y -
            (F0 / (m * J)) * (beta * m * r * omega ** 2 - gamma0 * x0),
    ];
};

export const rungeKutta = (
    func: GovernorDerivative,
    variables: GovernorState,
    t: number,
    dt: number,
    ...params: number[]
): GovernorState => {
    const k1 = func(variables, t, ...params);
    const k2 = func(
        variables.map(
            (value, index) => value + 0.5 * dt * k1[index],
        ) as GovernorState,
        t + 0.5 * dt,
        ...params,
    );
    const k3 = func(
        variables.map(
            (value, index) => value + 0.5 * dt * k2[index],
        ) as GovernorState,
        t + 0.5 * dt,
        ...params,
    );
    const k4 = func(
        variables.map(
            (value, index) => value + dt * k3[index],
        ) as GovernorState,
        t + dt,
        ...params,
    );

    return variables.map(
        (value, index) =>
            value +
            (dt / 6) * (k1[index] + 2 * k2[index] + 2 * k3[index] + k4[index]),
    ) as GovernorState;
};

export const solveGovernor = ({
    initialConditions,
    tSpan,
    dt,
    params,
}: {
    initialConditions: GovernorState;
    tSpan: number[];
    dt: number;
    params: {
        a: number;
        b: number;
        F0: number;
        m: number;
        J: number;
        beta: number;
        r: number;
        gamma0: number;
        x0: number;
    };
}): GovernorState[] => {
    const solution: GovernorState[] = [initialConditions];

    for (let index = 1; index < tSpan.length; index++) {
        solution.push(
            rungeKutta(
                wattGovernor,
                solution[index - 1],
                tSpan[index - 1],
                dt,
                params.a,
                params.b,
                params.F0,
                params.m,
                params.J,
                params.beta,
                params.r,
                params.gamma0,
                params.x0,
            ),
        );
    }

    return solution;
};
