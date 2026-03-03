import { useEffect, useState } from "react";
import { getStorageNumberArray } from "../helpers";
import type { SolutionData } from "../types";

type UseGovernorSeriesDataArgs = {
    solution: SolutionData;
    type: boolean;
    play: boolean;
};

// Хук подготавливает входные ряды для анимации регулятора:
// - основной ряд скоростей yData
// - ряд rotor (для сервомоторной модели)
// - минимумы/максимумы для нормализации формул кинематики
export const useGovernorSeriesData = ({
    solution,
    type,
    play,
}: UseGovernorSeriesDataArgs) => {
    const [yData, setYData] = useState<number[]>([]);
    const [rotor, setRotor] = useState<number[]>([]);
    const [minSpeed, setMinSpeed] = useState(0);
    const [maxSpeed, setMaxSpeed] = useState(0);

    // Источник данных зависит от выбранного типа модели.
    // Для классической модели берем решение ODE из props.solution,
    // для сервомоторной — подготовленные массивы из localStorage.
    useEffect(() => {
        if (!type) {
            setYData(solution?.map((row) => row[0]) ?? []);
            return;
        }

        setYData(getStorageNumberArray("zValues"));
        setRotor(getStorageNumberArray("yValues"));
    }, [solution, type, play]);

    // По текущему ряду скоростей считаем диапазон,
    // который используется в формулах углов/смещений.
    useEffect(() => {
        if (yData.length > 0) {
            setMinSpeed(Math.min(...yData));
            setMaxSpeed(Math.max(...yData));
        }
    }, [yData]);

    return {
        yData,
        rotor,
        minSpeed,
        maxSpeed,
    };
};
