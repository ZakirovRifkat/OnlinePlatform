// Формирует путь к текстуре металла по типу карты (Color, Roughness и т.д.).
export const metalTextureName = (mapType: string) =>
    `/Metal/Metal035_1K-JPG_${mapType}.jpg`;

export type KinematicsArgs = {
    type: boolean;
    speed: number;
    minSpeed: number;
    maxSpeed: number;
};

// Вычисляет кинематику регулятора для текущей скорости:
// - вертикальное смещение муфты (speedSleeve)
// - углы верхнего и нижнего рычагов (angleUp/angleDown)
// Формулы разделены для классической и сервомоторной модели.
export const calculateKinematics = ({
    type,
    speed,
    minSpeed,
    maxSpeed,
}: KinematicsArgs) => {
    // Классическая модель регулятора.
    if (!type) {
        return {
            speedSleeve:
                (3 * (speed * 100 - minSpeed)) / (maxSpeed - minSpeed) - 3.3,
            angleUp:
                ((speed * 100 - minSpeed) * 26.06) / (maxSpeed - minSpeed) +
                22.5,
            angleDown:
                ((speed * 100 - minSpeed) * (64.2 - 27.7)) /
                    (maxSpeed - minSpeed) +
                27.7,
        };
    }

    // Модель с сервомотором.
    return {
        speedSleeve:
            (3 * (speed - minSpeed * 10)) / (maxSpeed * 10 - minSpeed * 10) -
            3.3,
        angleUp:
            ((speed - minSpeed * 10) * 26.06) /
                (maxSpeed * 10 - minSpeed * 10) +
            22.5,
        angleDown:
            ((speed - minSpeed * 10) * (64.2 - 27.7)) /
                (maxSpeed * 10 - minSpeed * 10) +
            27.7,
    };
};
