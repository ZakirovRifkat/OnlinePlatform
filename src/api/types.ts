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
