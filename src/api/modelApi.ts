import { apiClient } from "./client";
import {
    ClassicModelRequestParams,
    ModelRequestParams,
    ModelResponse,
} from "./types";

const SERVO_MODEL_ENDPOINT = "/servomodel";
const CLASSIC_MODEL_ENDPOINT = "/classicmodel";

type NumericRequestParams = Record<string, number | number[]>;
type ArrayLengthRules = Record<string, number>;

const assertFiniteNumber = (name: string, value: number) => {
    if (!Number.isFinite(value)) {
        throw new Error(`${name} must be a finite number`);
    }
};

const assertFiniteParams = (
    params: NumericRequestParams,
    arrayLengthRules: ArrayLengthRules,
) => {
    Object.entries(params).forEach(([name, value]) => {
        if (Array.isArray(value)) {
            const requiredLength = arrayLengthRules[name];
            if (
                requiredLength !== undefined &&
                value.length !== requiredLength
            ) {
                throw new Error(
                    `${name} must contain exactly ${requiredLength} numbers`,
                );
            }

            value.forEach((item, index) => {
                if (!Number.isFinite(item)) {
                    throw new Error(
                        `${name}[${index}] must be a finite number`,
                    );
                }
            });
            return;
        }

        assertFiniteNumber(name, value);
    });
};

const serializeParams = (params: NumericRequestParams) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach((item) => {
                searchParams.append(key, String(item));
            });
            return;
        }

        searchParams.set(key, String(value));
    });

    return searchParams.toString();
};

const normalizeResponse = (
    data: ModelResponse,
    minRowLength: number,
): ModelResponse => {
    const t = Array.isArray(data.t) ? data.t.filter(Number.isFinite) : [];
    const yRaw = Array.isArray(data.y) ? data.y : [];
    const y = yRaw
        .map((row) =>
            Array.isArray(row)
                ? row.filter((value) => Number.isFinite(value))
                : [],
        )
        .filter((row) => row.length >= minRowLength);

    const normalizedLength = Math.min(t.length, y.length);

    return {
        ...data,
        t: t.slice(0, normalizedLength),
        y: y.slice(0, normalizedLength),
    };
};

const requestModel = async (
    endpoint: string,
    params: NumericRequestParams,
    minRowLength: number,
    signal?: AbortSignal,
): Promise<ModelResponse> => {
    const response = await apiClient.get<ModelResponse>(endpoint, {
        params,
        paramsSerializer: () => serializeParams(params),
        signal,
    });

    return normalizeResponse(response.data, minRowLength);
};

export const fetchModelData = async (
    params: ModelRequestParams,
    signal?: AbortSignal,
): Promise<ModelResponse> => {
    assertFiniteParams(params, { initial: 4 });
    return requestModel(SERVO_MODEL_ENDPOINT, params, 4, signal);
};

export const fetchClassicModelData = async (
    params: ClassicModelRequestParams,
    signal?: AbortSignal,
): Promise<ModelResponse> => {
    assertFiniteParams(params, { initial: 3 });
    return requestModel(CLASSIC_MODEL_ENDPOINT, params, 3, signal);
};
