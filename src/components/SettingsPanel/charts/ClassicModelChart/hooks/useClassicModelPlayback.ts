import { useEffect, useMemo, useState } from "react";
import type { SolutionData } from "../../../../Governor/types";

type UseClassicModelPlaybackParams = {
    play: boolean;
    playStartedAt: number | null;
    solution: SolutionData;
    tSpan: number[];
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

export const useClassicModelPlayback = ({
    play,
    playStartedAt,
    solution,
    tSpan,
}: UseClassicModelPlaybackParams) => {
    const [currentTime, setCurrentTime] = useState(0);

    const yData = useMemo(
        () => solution?.map((row) => row[0]) ?? [],
        [solution],
    );

    useEffect(() => {
        if (!play || playStartedAt === null || tSpan.length === 0) {
            return;
        }

        const updateCurrentTime = () => {
            const elapsedSeconds = Math.max(
                0,
                (Date.now() - playStartedAt) / 1000,
            );
            setCurrentTime(resolveCurrentTime(tSpan, elapsedSeconds));
        };

        updateCurrentTime();
        const intervalId = window.setInterval(updateCurrentTime, 30);

        return () => {
            clearInterval(intervalId);
        };
    }, [play, playStartedAt, tSpan]);

    useEffect(() => {
        setCurrentTime(tSpan[0] ?? 0);
    }, [solution, tSpan]);

    const minY = yData.length ? Math.min(...yData) : 0;
    const maxY = yData.length ? Math.max(...yData) : 1;

    return {
        currentTime,
        maxY,
        minY,
        yData,
    };
};
