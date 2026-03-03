import { useEffect, useRef } from "react";
import { CLASSIC_UPDATE_DELAY_MS, SERVO_UPDATE_DELAY_MS } from "../constants";

type UseGovernorPlaybackArgs = {
    play: boolean;
    type: boolean;
    yData: number[];
    rotor: number[];
};

// Хук пошагово обновляет текущую скорость вращения для анимации.
// Значения хранятся в ref, чтобы useFrame читал их без лишних ререндеров.
export const useGovernorPlayback = ({
    play,
    type,
    yData,
    rotor,
}: UseGovernorPlaybackArgs) => {
    const speedRef = useRef(0);
    const rotorSpeedRef = useRef(0);
    const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // При старте запускаем рекурсивный таймер, который
        // продвигает индекс по массивам данных.
        if (play) {
            let index = 0;

            const updateRotation = () => {
                if (index < yData.length) {
                    // Классическая и сервомоторная модель имеют разный масштаб скорости.
                    if (!type) {
                        speedRef.current = yData[index] / 100;
                    } else {
                        speedRef.current = yData[index] * 10;
                        const minimum = rotor.length ? Math.min(...rotor) : 0;
                        rotorSpeedRef.current =
                            (rotor[index] ?? 0) + Math.abs(minimum) * 1.1;
                    }

                    index++;
                    // Шаг таймера зависит от типа модели.
                    if (!type) {
                        if (timeoutIdRef.current) {
                            clearTimeout(timeoutIdRef.current);
                        }
                        timeoutIdRef.current = setTimeout(
                            updateRotation,
                            CLASSIC_UPDATE_DELAY_MS,
                        );
                    } else {
                        if (timeoutIdRef.current) {
                            clearTimeout(timeoutIdRef.current);
                        }
                        timeoutIdRef.current = setTimeout(
                            updateRotation,
                            SERVO_UPDATE_DELAY_MS,
                        );
                    }
                }
            };

            updateRotation();
            // Если воспроизведение остановлено — гасим таймер.
        } else if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
        }

        // Очистка при размонтировании или смене зависимостей.
        return () => {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
        };
    }, [play, type, yData, rotor]);

    return {
        speedRef,
        rotorSpeedRef,
    };
};
