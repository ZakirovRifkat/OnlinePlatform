import { Canvas } from "@react-three/fiber";
import type { RootState } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Governor } from "../Governor";
import {
    METAL_TEXTURE_TYPES,
    SERVO_UPDATE_DELAY_MS,
} from "../Governor/constants";
import { metalTextureName } from "../Governor/helpers";
import { LeverAssemblyInScene } from "../Lever/LeverAssemblyInScene";
import type { LeverRightPosition } from "../Lever/types";
import { RotorEngineInScene, sceneBlueprint } from "../RotorEngine";
import { ServoMotorComponent } from "../ServoMotor";
import { useServoStore } from "../../store/contentStore";
import type { GovernorModelProps } from "./types";

const ROTOR_SPEED_MULTIPLIER = 18;
const SERVO_TRIPLE_TRAVEL = 0.3;
const SERVO_SINGLE_TRAVEL = 0;

export const GovernorModel = (props: GovernorModelProps) => {
    const servoStore = useServoStore();
    const [rotorSpeedFactor, setRotorSpeedFactor] = useState(0);
    const [scene, setScene] = useState<RootState["scene"] | null>(null);
    const [servoTripleSignal, setServoTripleSignal] = useState(0);
    const [sleeveProgress, setSleeveProgress] = useState(0);
    const [leverRightPosition, setLeverRightPosition] =
        useState<LeverRightPosition>({ x: 0, y: 0, yDisplacement: 0 });
    const [lever1Position, setLever1Position] = useState<LeverRightPosition>({
        x: 0,
        y: 0,
        yDisplacement: 0,
    });
    const [lever2Position, setLever2Position] = useState<LeverRightPosition>({
        x: 0,
        y: 0,
        yDisplacement: 0,
    });
    const rotorSpeedFactorRef = useRef(0);
    const servoSignalTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );

    const handleRotorSpeedFactorChange = useCallback((value: number) => {
        const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0;
        if (Math.abs(rotorSpeedFactorRef.current - safeValue) < 0.005) {
            return;
        }

        rotorSpeedFactorRef.current = safeValue;
        setRotorSpeedFactor(safeValue);
    }, []);

    const handleLeverRightPositionChange = useCallback(
        (position: LeverRightPosition) => {
            setLeverRightPosition(position);
        },
        [],
    );

    const handleLever1PositionChange = useCallback(
        (position: LeverRightPosition) => {
            setLever1Position(position);
        },
        [],
    );

    const handleLever2PositionChange = useCallback(
        (position: LeverRightPosition) => {
            setLever2Position(position);
        },
        [],
    );

    const rotorTexturePaths = useMemo(
        () => ({
            color: metalTextureName(METAL_TEXTURE_TYPES[0]),
            displacement: metalTextureName(METAL_TEXTURE_TYPES[1]),
            normal: metalTextureName(METAL_TEXTURE_TYPES[2]),
            roughness: metalTextureName(METAL_TEXTURE_TYPES[3]),
            metalness: metalTextureName(METAL_TEXTURE_TYPES[4]),
        }),
        [],
    );

    const servoTexturePaths = useMemo(
        () => ({
            color: metalTextureName(METAL_TEXTURE_TYPES[0]),
            normal: metalTextureName(METAL_TEXTURE_TYPES[2]),
            roughness: metalTextureName(METAL_TEXTURE_TYPES[3]),
            metalness: metalTextureName(METAL_TEXTURE_TYPES[4]),
        }),
        [],
    );

    const rotorAtEngineBlockBlueprint = useMemo(
        () => ({
            ...sceneBlueprint,
            groups: sceneBlueprint.groups.map((group) =>
                group.id === "assembly-root"
                    ? {
                          ...group,
                          position: [-25, -20.8, 0] as [number, number, number],
                          rotation: [0, 180, 0] as [number, number, number],
                      }
                    : group,
            ),
        }),
        [],
    );

    const handleCanvasCreated = useCallback((state: RootState) => {
        const canvas = state.gl.domElement;
        setScene(state.scene);

        canvas.addEventListener(
            "webglcontextlost",
            (event) => {
                // Prevent default browser behavior so the page can recover context.
                event.preventDefault();
            },
            false,
        );
    }, []);

    useEffect(() => {
        if (!props.type) {
            setServoTripleSignal(0);
            return;
        }

        // Map sleeveProgress [0..1] to servoTripleSignal [-1..1]
        // sleeveProgress = 0 (bottom) -> signal = -1 (bottom position)
        // sleeveProgress = 1 (top) -> signal = 1 (top position)
        const signal = sleeveProgress * 2 - 1;
        setServoTripleSignal(signal);
    }, [props.type, sleeveProgress]);

    return (
        <Canvas
            style={{
                height: "100%",
                width: "100%",
                background: "transparent",
                opacity: `${props.isModelLoaded ? 1 : 0}`,
                transition: "opacity 1s ease-in",
            }}
            camera={{
                fov: 50,
                position: [0, 2, 25],
            }}
            dpr={[1, 1.5]}
            onCreated={handleCanvasCreated}
        >
            <scene backgroundIntensity={0}>
                <ambientLight intensity={1} />
                <pointLight position={[124, 10, 10]} />

                <OrbitControls
                    maxDistance={80}
                    minDistance={2}
                    enablePan={false}
                    enableRotate
                    minPolarAngle={0.1}
                    maxPolarAngle={Math.PI - 0.1}
                    enabled={props.orbit}
                />
                <Environment preset="warehouse" background blur={100} />

                <Governor
                    colorMap={props.colorMap}
                    displacementMap={props.displacementMap}
                    normalMap={props.normalMap}
                    roughnessMap={props.roughnessMap}
                    isModelLoaded={props.isModelLoaded}
                    setModelLoaded={props.setModelLoaded}
                    play={props.play}
                    solution={props.solution}
                    type={props.type}
                    onRotorSpeedFactorChange={handleRotorSpeedFactorChange}
                    onSleeveProgressChange={setSleeveProgress}
                    servoTripleSignal={servoTripleSignal}
                    leverRightPosition={leverRightPosition}
                    lever2Position={lever2Position}
                />

                <RotorEngineInScene
                    blueprint={rotorAtEngineBlockBlueprint}
                    rotationSpeedFactor={
                        props.play
                            ? rotorSpeedFactor * ROTOR_SPEED_MULTIPLIER
                            : 0
                    }
                    scale={0.4}
                    texturePaths={rotorTexturePaths}
                />

                {props.type && scene && (
                    <>
                        <ServoMotorComponent
                            scene={scene}
                            position={[8, -11.4, -3.2]}
                            rotationDeg={[0, 90, 0]}
                            scale={4.8}
                            texturePaths={servoTexturePaths}
                            motion={{
                                tripleTravel: SERVO_TRIPLE_TRAVEL,
                                singleTravel: SERVO_SINGLE_TRAVEL,
                            }}
                            servoTripleSignal={servoTripleSignal}
                            leverRightPosition={lever2Position}
                        />

                        {/* Second lever for servo mode */}
                        <LeverAssemblyInScene
                            play={props.play}
                            sleeveProgress={sleeveProgress}
                            onLeverRightPositionChange={
                                handleLever2PositionChange
                            }
                            sceneTransform={{
                                position: [14.1, -5.1, 0],
                                rotationDeg: [0, 90, 0],
                                scale: 1,
                            }}
                        />
                    </>
                )}

                {!props.type && (
                    <LeverAssemblyInScene
                        play={props.play}
                        sleeveProgress={sleeveProgress}
                        onLeverRightPositionChange={
                            handleLeverRightPositionChange
                        }
                    />
                )}
            </scene>
        </Canvas>
    );
};
