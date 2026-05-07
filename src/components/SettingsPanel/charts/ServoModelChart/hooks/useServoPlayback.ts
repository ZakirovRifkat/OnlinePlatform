import { useEffect, useState } from "react";

type UseServoPlaybackParams = {
    isPlay: boolean;
    playStartedAt: number | null;
    loading: boolean;
    timeData: number[];
};

const resolveCurrentTime = (timeData: number[], elapsedSeconds: number) => {
    if (timeData.length === 0) {
        return 0;
    }

    if (elapsedSeconds <= timeData[0]) {
        return timeData[0] ?? 0;
    }

    for (let i = 1; i < timeData.length; i += 1) {
        const currentPoint = timeData[i] ?? 0;
        if (elapsedSeconds < currentPoint) {
            return timeData[i - 1] ?? 0;
        }
    }

    return timeData[timeData.length - 1] ?? 0;
};

export const useServoPlayback = ({
    isPlay,
    playStartedAt,
    loading,
    timeData,
}: UseServoPlaybackParams) => {
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        if (
            loading ||
            !isPlay ||
            playStartedAt === null ||
            timeData.length === 0
        ) {
            return;
        }

        const updateCurrentTime = () => {
            const elapsedSeconds = Math.max(
                0,
                (Date.now() - playStartedAt) / 1000,
            );
            setCurrentTime(resolveCurrentTime(timeData, elapsedSeconds));
        };

        updateCurrentTime();
        const intervalId = window.setInterval(updateCurrentTime, 30);

        return () => {
            clearInterval(intervalId);
        };
    }, [isPlay, playStartedAt, loading, timeData]);

    useEffect(() => {
        setCurrentTime(timeData[0] ?? 0);
    }, [loading, timeData]);

    return currentTime;
};
