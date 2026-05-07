import { useEffect, useMemo, useRef } from "react";
import type { Scene } from "three";
import { ServoMotor } from "./ServoMotor";
import type {
    LeverRightPosition,
    ServoMotorChildOffsets,
    ServoMotorModelUrls,
    ServoMotorMotionOptions,
    ServoMotorTexturePaths,
    Vec3,
} from "./types";

export interface ServoMotorComponentProps {
    scene: Scene;
    position?: Vec3;
    rotationDeg?: Vec3;
    scale?: number | Vec3;
    texturePaths?: ServoMotorTexturePaths;
    modelUrls?: Partial<ServoMotorModelUrls>;
    childOffsets?: ServoMotorChildOffsets;
    motion?: ServoMotorMotionOptions;
    servoTripleSignal?: number;
    leverRightPosition?: LeverRightPosition;
    onLoaded?: (servo: ServoMotor) => void;
}

export const ServoMotorComponent = ({
    scene,
    position,
    rotationDeg,
    scale,
    texturePaths,
    modelUrls,
    childOffsets,
    motion,
    servoTripleSignal = 0,
    leverRightPosition,
    onLoaded,
}: ServoMotorComponentProps) => {
    const servoRef = useRef<ServoMotor | null>(null);
    const servoTripleSignalRef = useRef(servoTripleSignal);
    const leverRightPositionRef = useRef(leverRightPosition);
    const mountPropsRef = useRef({
        position,
        rotationDeg,
        scale,
        texturePaths,
        modelUrls,
        childOffsets,
        motion,
    });

    const positionKey = useMemo(
        () => JSON.stringify(position ?? null),
        [position],
    );
    const rotationDegKey = useMemo(
        () => JSON.stringify(rotationDeg ?? null),
        [rotationDeg],
    );
    const scaleKey = useMemo(() => JSON.stringify(scale ?? null), [scale]);
    const texturePathsKey = useMemo(
        () => JSON.stringify(texturePaths ?? {}),
        [texturePaths],
    );
    const modelUrlsKey = useMemo(
        () => JSON.stringify(modelUrls ?? {}),
        [modelUrls],
    );
    const childOffsetsKey = useMemo(
        () => JSON.stringify(childOffsets ?? {}),
        [childOffsets],
    );
    const motionKey = useMemo(() => JSON.stringify(motion ?? {}), [motion]);

    useEffect(() => {
        servoTripleSignalRef.current = servoTripleSignal;
    }, [servoTripleSignal]);

    useEffect(() => {
        leverRightPositionRef.current = leverRightPosition;
    }, [leverRightPosition]);

    useEffect(() => {
        mountPropsRef.current = {
            position,
            rotationDeg,
            scale,
            texturePaths,
            modelUrls,
            childOffsets,
            motion,
        };
    }, [
        position,
        rotationDeg,
        scale,
        texturePaths,
        modelUrls,
        childOffsets,
        motion,
    ]);

    useEffect(() => {
        let disposed = false;
        const mountProps = mountPropsRef.current;

        const servo = new ServoMotor({
            scene,
            position: mountProps.position,
            rotationDeg: mountProps.rotationDeg,
            scale: mountProps.scale,
            texturePaths: mountProps.texturePaths,
            modelUrls: mountProps.modelUrls,
            childOffsets: mountProps.childOffsets,
            motion: mountProps.motion,
        });

        servoRef.current = servo;

        void servo
            .load()
            .then(() => {
                if (disposed) {
                    return;
                }

                servo.setServoTripleSignal(servoTripleSignalRef.current);
                onLoaded?.(servo);
            })
            .catch(() => {
                // Surface errors through app-level logging if needed.
            });

        return () => {
            disposed = true;
            servo.dispose();
            if (servoRef.current === servo) {
                servoRef.current = null;
            }
        };
    }, [
        scene,
        positionKey,
        rotationDegKey,
        scaleKey,
        texturePathsKey,
        modelUrlsKey,
        childOffsetsKey,
        motionKey,
        onLoaded,
    ]);

    useEffect(() => {
        const servo = servoRef.current;
        if (!servo) {
            return;
        }

        servo.setTransform({
            position,
            rotationDeg,
            scale,
        });
    }, [position, rotationDeg, scale]);

    useEffect(() => {
        const servo = servoRef.current;
        if (!servo || !texturePaths) {
            return;
        }

        void servo.setTextures(texturePaths);
    }, [texturePaths]);

    useEffect(() => {
        const servo = servoRef.current;
        if (!servo) {
            return;
        }

        servo.setServoTripleSignal(servoTripleSignal);
    }, [servoTripleSignal]);

    useEffect(() => {
        const servo = servoRef.current;
        if (!servo || !leverRightPosition) {
            return;
        }

        // Use displacement instead of absolute position
        servo.setServoSingleFromLeverDisplacement(
            leverRightPosition.yDisplacement,
        );
    }, [leverRightPosition]);

    return null;
};
