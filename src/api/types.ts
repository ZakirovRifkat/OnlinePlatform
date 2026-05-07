export type ModelRequestParams = {
    A: number;
    B: number;
    C: number;
    delta: number;
    initial: number[];
};

export type ModelResponse = {
    t: number[];
    y: number[][];
};

export type ClassicModelRequestParams = {
    a: number;
    b: number;
    F0: number;
    m: number;
    J: number;
    beta: number;
    r: number;
    gamma0: number;
    x0: number;
    dt: number;
    tEnd: number;
    initial: number[];
};
