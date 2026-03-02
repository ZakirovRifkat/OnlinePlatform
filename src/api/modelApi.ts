import { apiClient } from "./client";
import { ModelRequestParams, ModelResponse } from "./types";

const MODEL_ENDPOINT = "/model";

export const fetchModelData = async (
    params: ModelRequestParams,
): Promise<ModelResponse> => {
    const { A, B, C, delta, initial } = params;

    const paramsSerializer = () => {
        const searchParams = new URLSearchParams();
        searchParams.set("A", String(A));
        searchParams.set("B", String(B));
        searchParams.set("C", String(C));
        searchParams.set("delta", String(delta));

        initial.forEach((value) => {
            searchParams.append("initial", String(value));
        });

        return searchParams.toString();
    };

    const response = await apiClient.get<ModelResponse>(MODEL_ENDPOINT, {
        params: {
            A,
            B,
            C,
            delta,
            initial,
        },
        paramsSerializer,
    });

    return response.data;
};
