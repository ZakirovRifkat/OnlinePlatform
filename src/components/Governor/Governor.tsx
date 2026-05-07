import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo, useRef } from "react";
import type { MutableRefObject, RefObject } from "react";
import { TextureLoader } from "three";
import Spindle from "../../models/Spindle";
import EngineGear from "../../models/EngineGear";
import GovernonGear from "../../models/GovernonGear";
import GovernorLink from "../../models/GovernorLink";
import Sleeve from "../../models/Sleeve";
import Knuckle from "../../models/Knuckle";
import type { GovernorProps } from "./types";
import { METAL_TEXTURE_TYPES } from "./constants";
import { calculateKinematics, metalTextureName } from "./helpers";
import { useGovernorPlayback } from "./hooks/useGovernorPlayback";
import { useGovernorSeriesData } from "./hooks/useGovernorSeriesData";

const waterVertexShader = `
uniform float uTime;
varying vec3 vNormal;

void main() {
  vNormal = normal;

  vec3 worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  vec3 newPosition = position;

  if (position.z > 0.49) {
    newPosition.z += sin(worldPosition.x * 2.0 + uTime * 2.0) * 0.2;
    newPosition.z += cos(worldPosition.y * 3.0 + uTime * 1.5) * 0.15;
  }

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;
const waterFragmentShader = `
varying vec3 vNormal;

void main() {
  vec3 deepColor = vec3(0.0, 0.3, 0.7);
  vec3 shallowColor = vec3(0.3, 0.7, 1.0);
  float fresnel = pow(1.0 - abs(normalize(vNormal).z), 2.0);
  vec3 color = mix(deepColor, shallowColor, fresnel);
  gl_FragColor = vec4(color, 0.8);
}
`;

export const Governor = (props: GovernorProps) => {
    const groupRef = useRef<THREE.Group | null>(null);
    const engineGearSpinRef = useRef<THREE.Group | null>(null);
    const leftHandleUp = useRef<THREE.Group | null>(null);
    const rightHandleUp = useRef<THREE.Group | null>(null);
    const leftHandleDown = useRef<THREE.Mesh | null>(null);
    const rightHandleDown = useRef<THREE.Mesh | null>(null);
    const sleeveRef = useRef<THREE.Group | null>(null);
    const sleeveGuideRef = useRef<THREE.Group | null>(null);
    const sleeveKnucklePivotRef = useRef<THREE.Group | null>(null);
    const sleeveToRodOffsetYRef = useRef<number | null>(null);
    const sleeveBaseYRef = useRef<number | null>(null);
    const lastRotorFactorRef = useRef<number | null>(null);
    const lastSleeveProgressRef = useRef<number | null>(null);

    const rodBaseRotationZ = Math.PI / 2;
    const sleeveToBallRodLength = props.type ? 11 : 5.2;

    const engineShaftGeometry = useMemo(
        () => new THREE.CylinderGeometry(0.6, 0.6, 3, 128, 96),
        [],
    );
    const engineOutletLength = 3.4;
    const engineOutletCenterY = -8.2;
    const gateHeight = 0.15;
    const servoOutletYOffset = props.type ? -5.8 : 0;
    const outletAssemblyX = props.type ? -15 : -2.8;
    const gateX = props.type ? 4.6 : 4.6; // X position for gate: servo vs classic
    // const engineSecondOutletOffsetX = 2.3;

    const engineOutletGeometry = useMemo(
        () =>
            new THREE.CylinderGeometry(
                0.8,
                0.8,
                engineOutletLength,
                96,
                1,
                true,
                Math.PI / 2,
                Math.PI,
            ),
        [],
    );

    const leftRef = useRef<THREE.Mesh>(null!);
    const rightRef = useRef<THREE.Mesh>(null!);
    const gateRef = useRef<THREE.Group>(null!);
    const gateBaseWorldPosRef = useRef<THREE.Vector3 | null>(null);
    const gateBaseSliderProgressRef = useRef<number | null>(null);
    const prevModeRef = useRef<boolean>(props.type);

    const sleeveRimGeometry = useMemo(
        () => new THREE.TorusGeometry(1, 0.06, 32, 96),
        [],
    );
    const sleeveBallGeometry = useMemo(
        () => new THREE.SphereGeometry(0.16, 64, 64),
        [],
    );
    const handleBallGeometry = useMemo(
        () => new THREE.SphereGeometry(0.7, 32, 32),
        [],
    );

    const metalTexturePaths = useMemo(
        () => METAL_TEXTURE_TYPES.map(metalTextureName),
        [],
    );

    const [
        MetalcolorMap,
        MetaldisplacementMap,
        MetalnormalMap,
        MetalroughnessMap,
        Metalness,
    ] = useLoader(TextureLoader, metalTexturePaths);

    const { yData, rotor, minSpeed, maxSpeed } = useGovernorSeriesData({
        solution: props.solution,
        type: props.type,
        play: props.play,
    });

    const { speedRef, rotorSpeedRef } = useGovernorPlayback({
        play: props.play,
        type: props.type,
        yData,
        rotor,
    });

    const metalMaps = useMemo(
        () => ({
            colorMap: MetalcolorMap,
            displacementMap: MetaldisplacementMap,
            normalMap: MetalnormalMap,
            roughnessMap: MetalroughnessMap,
            Metalness,
        }),
        [
            MetalcolorMap,
            MetaldisplacementMap,
            MetalnormalMap,
            MetalroughnessMap,
            Metalness,
        ],
    );

    const engineShaftStripeTexture = useMemo(() => {
        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 128;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
            const fallbackTexture = new THREE.Texture();
            fallbackTexture.needsUpdate = true;
            return fallbackTexture;
        }

        const darkGold = "#6b4f1d";
        const gold = "#c7a340";

        ctx.fillStyle = darkGold;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const stripeWidth = 42;
        const stripeGap = 28;
        const blurWidth = 8;
        for (
            let x = 0;
            x < canvas.width + stripeWidth;
            x += stripeWidth + stripeGap
        ) {
            const centerWidth = Math.max(1, stripeWidth - blurWidth * 2);

            const leftEdge = ctx.createLinearGradient(x, 0, x + blurWidth, 0);
            leftEdge.addColorStop(0, darkGold);
            leftEdge.addColorStop(1, gold);
            ctx.fillStyle = leftEdge;
            ctx.fillRect(x, 0, blurWidth, canvas.height);

            ctx.fillStyle = gold;
            ctx.fillRect(x + blurWidth, 0, centerWidth, canvas.height);

            const rightStart = x + blurWidth + centerWidth;
            const rightEdge = ctx.createLinearGradient(
                rightStart,
                0,
                rightStart + blurWidth,
                0,
            );
            rightEdge.addColorStop(0, gold);
            rightEdge.addColorStop(1, darkGold);
            ctx.fillStyle = rightEdge;
            ctx.fillRect(rightStart, 0, blurWidth, canvas.height);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.repeat.set(6, 1);
        texture.needsUpdate = true;

        return texture;
    }, []);

    const standMaterialMaps = useMemo(
        () => ({
            map: props.colorMap,
            displacementMap: props.displacementMap,
            normalMap: props.normalMap,
            roughnessMap: props.roughnessMap,
        }),
        [
            props.colorMap,
            props.displacementMap,
            props.normalMap,
            props.roughnessMap,
        ],
    );

    const renderUpperHandle = ({
        position,
        rotation,
        groupRef,
    }: {
        position: [number, number, number];
        rotation: [number, number, number];
        groupRef: MutableRefObject<THREE.Group | null>;
    }) => (
        <group
            position={position}
            rotation={rotation}
            ref={groupRef as RefObject<THREE.Group>}
        >
            <mesh rotation={[0, 0, -Math.PI / 2]} position={[0, 0.07, 0]}>
                <GovernorLink {...metalMaps} />
                <mesh
                    rotation={[0, 0, Math.PI / 2]}
                    position={[5.94, 0.5, 0.02]}
                    scale={1}
                    geometry={handleBallGeometry}
                >
                    <meshStandardMaterial
                        displacementScale={0}
                        color={"yellow"}
                        {...standMaterialMaps}
                    />
                </mesh>
            </mesh>
        </group>
    );

    const sleeveBottomY = useMemo(() => {
        const minSpeedInput = !props.type ? minSpeed / 100 : minSpeed * 10;
        return calculateKinematics({
            type: props.type,
            speed: minSpeedInput,
            minSpeed,
            maxSpeed,
        }).speedSleeve;
    }, [props.type, minSpeed, maxSpeed]);

    const sleeveTopY = useMemo(() => {
        const maxSpeedInput = !props.type ? maxSpeed / 100 : maxSpeed * 10;
        return calculateKinematics({
            type: props.type,
            speed: maxSpeedInput,
            minSpeed,
            maxSpeed,
        }).speedSleeve;
    }, [props.type, minSpeed, maxSpeed]);

    useFrame(() => {
        const emitRotorFactor = (value: number) => {
            if (!props.onRotorSpeedFactorChange) {
                return;
            }

            const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0;
            if (
                lastRotorFactorRef.current !== null &&
                Math.abs(lastRotorFactorRef.current - safeValue) < 0.005
            ) {
                return;
            }

            lastRotorFactorRef.current = safeValue;
            props.onRotorSpeedFactorChange(safeValue);
        };

        // Check if mode changed
        const modeChanged = prevModeRef.current !== props.type;
        if (modeChanged) {
            prevModeRef.current = props.type;
            gateBaseWorldPosRef.current = null;
            gateBaseSliderProgressRef.current = null;

            // Reset gate position when mode changes
            if (gateRef.current) {
                gateRef.current.position.set(gateX, -10.25, -0.24);
            }
        }

        if (!props.play) {
            gateBaseWorldPosRef.current = null;
            gateBaseSliderProgressRef.current = null;
            emitRotorFactor(0);
        } else {
            // Reset gate position when play starts (if not already reset by mode change)
            if (
                gateRef.current &&
                gateBaseWorldPosRef.current === null &&
                !modeChanged
            ) {
                gateRef.current.position.set(gateX, -10.25, -0.24);
            }
        }

        if (
            props.isModelLoaded &&
            groupRef.current &&
            sleeveRef.current &&
            sleeveGuideRef.current
        ) {
            sleeveGuideRef.current.rotation.y =
                -groupRef.current.rotation.y - sleeveRef.current.rotation.y;
        }

        if (
            props.isModelLoaded &&
            sleeveRef.current &&
            sleeveKnucklePivotRef.current
        ) {
            if (sleeveToRodOffsetYRef.current === null) {
                sleeveToRodOffsetYRef.current =
                    sleeveKnucklePivotRef.current.position.y -
                    sleeveRef.current.position.y;
            }

            if (sleeveBaseYRef.current === null) {
                sleeveBaseYRef.current = sleeveRef.current.position.y;
            }

            // Тяга сохраняет фиксированный угол и следует только по вертикали за муфтой.
            sleeveKnucklePivotRef.current.rotation.set(0, 0, rodBaseRotationZ);
            sleeveKnucklePivotRef.current.position.y =
                sleeveRef.current.position.y + sleeveToRodOffsetYRef.current;
        }

        // Основной цикл кадра: обновляем анимацию только когда модель загружена и включено воспроизведение.
        if (props.isModelLoaded && props.play) {
            // Защита от обращения к ref до инициализации объектов сцены.
            if (
                !groupRef.current ||
                !leftHandleUp.current ||
                !rightHandleUp.current ||
                !leftHandleDown.current ||
                !rightHandleDown.current ||
                !sleeveRef.current ||
                !sleeveGuideRef.current ||
                !sleeveKnucklePivotRef.current
            ) {
                return;
            }

            // Рассчитываем текущее положение ползунка и углы рычагов по входной скорости.
            const { speedSleeve, angleUp, angleDown } = calculateKinematics({
                type: props.type,
                speed: speedRef.current,
                minSpeed,
                maxSpeed,
            });

            const driveSpeed = !props.type
                ? speedRef.current
                : rotorSpeedRef.current / 2;

            // Вращаем главный узел: для сервомотора используется отдельная скорость ротора.
            groupRef.current.rotation.y += driveSpeed;
            emitRotorFactor(Math.abs(driveSpeed));

            // Обновляем углы верхних и нижних рычагов.
            leftHandleUp.current.rotation.z = THREE.MathUtils.degToRad(angleUp);
            leftHandleDown.current.rotation.x =
                THREE.MathUtils.degToRad(angleDown);

            // const delta = Math.abs(sleeveRef.current.position.y - speedSleeve);

            // Смещаем ползунок по оси Y.
            sleeveRef.current.position.y = speedSleeve;

            const sleeveRange = sleeveTopY - sleeveBottomY;
            const sliderTopProgress =
                Math.abs(sleeveRange) < 1e-6
                    ? 0
                    : THREE.MathUtils.clamp(
                          (speedSleeve - sleeveBottomY) / sleeveRange,
                          0,
                          1,
                      );

            if (props.onSleeveProgressChange) {
                if (
                    lastSleeveProgressRef.current === null ||
                    Math.abs(
                        lastSleeveProgressRef.current - sliderTopProgress,
                    ) > 0.005
                ) {
                    lastSleeveProgressRef.current = sliderTopProgress;
                    props.onSleeveProgressChange(sliderTopProgress);
                }
            }
            const targetRightWaterLevel = THREE.MathUtils.clamp(
                1 - sliderTopProgress,
                0.03,
                1,
            );

            const gateTravel = 0.9;

            if (rightRef.current) {
                const nextScaleZ = THREE.MathUtils.lerp(
                    rightRef.current.scale.z,
                    targetRightWaterLevel,
                    0.12,
                );
                rightRef.current.scale.z = nextScaleZ;
            }

            if (gateRef.current) {
                const parent = gateRef.current.parent;
                if (parent) {
                    // For classic model, initialize base position from lever_right
                    if (!props.type && props.leverRightPosition) {
                        if (!gateBaseWorldPosRef.current) {
                            const currentGatePos = gateRef.current.getWorldPosition(
                                new THREE.Vector3(),
                            );
                            gateBaseWorldPosRef.current = new THREE.Vector3(
                                props.leverRightPosition.x,
                                props.leverRightPosition.y,
                                currentGatePos.z,
                            );
                        }
                    } else if (!gateBaseWorldPosRef.current) {
                        gateBaseWorldPosRef.current =
                            gateRef.current.getWorldPosition(
                                new THREE.Vector3(),
                            );
                    }

                    if (gateBaseSliderProgressRef.current === null) {
                        gateBaseSliderProgressRef.current = sliderTopProgress;
                    }

                    const baseWorldPos = gateBaseWorldPosRef.current;
                    const baseSliderProgress =
                        gateBaseSliderProgressRef.current;

                    let targetGateOffsetY: number;
                    if (props.type) {
                        // Servo model: use lever2Position displacement
                        if (props.lever2Position) {
                            targetGateOffsetY = props.lever2Position.yDisplacement - 1.2;
                        } else {
                            // Fallback to servoTripleSignal if lever2Position not available
                            targetGateOffsetY = -THREE.MathUtils.clamp(
                                props.servoTripleSignal ?? 0,
                                -1,
                                1,
                            ) * gateTravel;
                        }
                    } else {
                        // Classic model: sync with lever_right position
                        if (props.leverRightPosition) {
                            targetGateOffsetY = props.leverRightPosition.y - baseWorldPos.y;
                        } else {
                            // Fallback to old behavior if leverRightPosition not provided
                            targetGateOffsetY = (baseSliderProgress - sliderTopProgress) * gateTravel;
                        }
                    }

                    const currentWorldPos = gateRef.current.getWorldPosition(
                        new THREE.Vector3(),
                    );
                    const targetWorldPos = new THREE.Vector3(
                        baseWorldPos.x,
                        baseWorldPos.y + targetGateOffsetY,
                        baseWorldPos.z,
                    );

                    currentWorldPos.lerp(targetWorldPos, 0.12);
                    gateRef.current.position.copy(
                        parent.worldToLocal(currentWorldPos),
                    );
                }
            }

            // console.log(Math.asin(delta / 10));

            rightHandleUp.current.rotation.z =
                THREE.MathUtils.degToRad(angleUp);
            rightHandleDown.current.rotation.x = THREE.MathUtils.degToRad(
                -1 * angleDown,
            );

            if (engineGearSpinRef.current) {
                engineGearSpinRef.current.rotation.y += driveSpeed;

                const shaftTextureOffset =
                    (engineShaftStripeTexture.offset.x + driveSpeed * 6) % 1;
                engineShaftStripeTexture.offset.x = shaftTextureOffset;
            }
        }

        // Как только все текстуры готовы, один раз помечаем модель как загруженную.
        if (
            props.colorMap &&
            props.displacementMap &&
            props.normalMap &&
            props.roughnessMap &&
            !props.isModelLoaded &&
            MetalcolorMap &&
            MetaldisplacementMap &&
            MetalnormalMap &&
            MetalroughnessMap &&
            Metalness
        ) {
            props.setModelLoaded(true);
        }
    });

    if (!props.isModelLoaded) {
        return null;
    }

    return (
        <>
            <group ref={groupRef}>
                {/* Левый рычаг */}
                {renderUpperHandle({
                    position: [1.05, 4.74, 0],
                    rotation: [0, 0, Math.PI / 8],
                    groupRef: leftHandleUp,
                })}
                {/* Правый рычаг */}
                {renderUpperHandle({
                    position: [-1.086, 4.74, 0],
                    rotation: [0, Math.PI, Math.PI / 8],
                    groupRef: rightHandleUp,
                })}
                {/* Ползунок с рычагами */}
                <group
                    ref={sleeveRef}
                    position={[0, -3.3, 0]}
                    rotation={[0, Math.PI / 2, 0]}
                >
                    {/* Ползунок */}
                    <mesh>
                        <Sleeve {...metalMaps} />
                    </mesh>
                    {/* Нижний левый рычаг*/}
                    <mesh
                        ref={leftHandleDown}
                        rotation={[Math.PI / 6.6, 0, -Math.PI / 2]}
                        position={[0, -0.06, 1.18]}
                    >
                        <Knuckle {...metalMaps} />
                    </mesh>
                    {/* Нижний правый рычаг */}
                    <mesh
                        ref={rightHandleDown}
                        rotation={[-Math.PI / 6.6, 0, -Math.PI / 2]}
                        position={[0, -0.06, -1.22]}
                    >
                        <Knuckle {...metalMaps} />
                    </mesh>

                    <group ref={sleeveGuideRef}>
                        <mesh
                            geometry={sleeveRimGeometry}
                            position={[0, -0.32, 0]}
                            rotation={[Math.PI / 2, 0, 0]}
                        >
                            <meshStandardMaterial
                                displacementScale={0}
                                {...standMaterialMaps}
                            />
                        </mesh>
                        <mesh
                            geometry={sleeveRimGeometry}
                            position={[0, -0.65, 0]}
                            rotation={[Math.PI / 2, 0, 0]}
                        >
                            <meshStandardMaterial
                                displacementScale={0}
                                {...standMaterialMaps}
                            />
                        </mesh>
                        <group position={[0, -0.5, 0]} rotation={[0, 0, 0]}>
                            <mesh
                                geometry={sleeveBallGeometry}
                                position={[1, 0, 0]}
                            >
                                <meshStandardMaterial
                                    displacementScale={0}
                                    color={"yellow"}
                                    {...standMaterialMaps}
                                />
                            </mesh>
                        </group>
                    </group>
                </group>

                {/* Стержень */}
                <mesh position={[-5.825, -4.8, 0]}>
                    <Spindle {...metalMaps} />
                </mesh>

                {/* Нижние шестерни */}
                <mesh position={[0, -5.5, 0]} rotation={[0, 0, 0]}>
                    <GovernonGear {...metalMaps} />
                </mesh>
            </group>
            <group
                ref={sleeveKnucklePivotRef}
                position={[1, -3.8, 0]}
                rotation={[0, 0, Math.PI / 2]}
            >
                <mesh position={[0, -sleeveToBallRodLength / 2, 0]}>
                    <cylinderGeometry
                        args={[0.14, 0.14, sleeveToBallRodLength, 32]}
                    />
                    <meshStandardMaterial
                        color={"#b8bec8"}
                        metalness={0.85}
                        roughness={0.3}
                    />
                </mesh>
            </group>
            <group position={[0.218, -7.58, 0]} rotation={[0, 0, Math.PI / 2]}>
                <group
                    ref={engineGearSpinRef}
                    position={[0, 0.4, 0]}
                    rotation={[Math.PI, 0, 0]}
                >
                    <EngineGear {...metalMaps} />
                    <mesh
                        geometry={engineShaftGeometry}
                        position={[0, -2.3, 0]}
                    >
                        <meshStandardMaterial
                            color={"#ffffff"}
                            map={engineShaftStripeTexture}
                            metalness={0.85}
                            roughness={0.4}
                        />
                    </mesh>
                </group>

                <group position={[outletAssemblyX, servoOutletYOffset, 0]}>
                    {/* Первый цилиндр */}
                    <group position={[0, engineOutletCenterY, 0]}>
                        {/* Корпус полуцилиндра */}
                        <mesh geometry={engineOutletGeometry}>
                            <meshStandardMaterial
                                color={"#8b929b"}
                                metalness={0.88}
                                roughness={0.34}
                                side={THREE.DoubleSide}
                            />
                        </mesh>

                        <WaterHalf
                            position={[-0.78, 0, -0.23]}
                            scaleRef={rightRef}
                            initialScale={1}
                        />
                    </group>

                    <group ref={gateRef} position={[gateX, -10.25, -0.24]}>
                        <mesh position={[-1.5, 0, 0]}>
                            <boxGeometry args={[3, gateHeight, 0.95]} />
                            <meshStandardMaterial
                                displacementScale={0}
                                color={"#b8bec8"}
                                metalness={0.88}
                                roughness={0.34}
                                {...standMaterialMaps}
                            />
                        </mesh>
                        {/* Pivot point marker */}
                        {/* <mesh position={[0, 0, 0]}>
                            <sphereGeometry args={[0.15, 16, 16]} />
                            <meshStandardMaterial
                                color={"#ff0000"}
                                emissive={"#ff0000"}
                                emissiveIntensity={0.5}
                            />
                        </mesh> */}
                    </group>

                    {/* Второй цилиндр */}
                    <group
                        position={[
                            0,
                            engineOutletCenterY - engineOutletLength,
                            0,
                        ]}
                    >
                        {/* Корпус полуцилиндра */}
                        <mesh geometry={engineOutletGeometry}>
                            <meshStandardMaterial
                                color={"#8b929b"}
                                metalness={0.88}
                                roughness={0.34}
                                side={THREE.DoubleSide}
                            />
                        </mesh>

                        <WaterHalf
                            position={[-0.78, -0.6, -0.23]}
                            scaleRef={leftRef}
                            initialScale={1}
                        />
                    </group>
                </group>
            </group>
        </>
    );
};

// --- Одна половина воды ---
function WaterHalf({
    position,
    scaleRef,
    initialScale,
}: {
    position: [number, number, number];
    scaleRef: React.RefObject<THREE.Mesh>;
    initialScale: number;
}) {
    const matRef = useRef<THREE.ShaderMaterial>(null!);
    const waterHalfGeometry = useMemo(() => {
        const geometry = new THREE.BoxGeometry(1, 4, 1, 50, 50, 1);
        geometry.translate(0, 0, 0.5);
        return geometry;
    }, []);

    const uniforms = useRef({
        uTime: { value: 0 },
    }).current;

    useFrame((state) => {
        uniforms.uTime.value = state.clock.getElapsedTime();
    });

    return (
        <mesh
            ref={scaleRef}
            position={position}
            rotation={[0, Math.PI / 2, 0]}
            scale={[1, 1, initialScale]}
            geometry={waterHalfGeometry}
        >
            <shaderMaterial
                ref={matRef}
                vertexShader={waterVertexShader}
                fragmentShader={waterFragmentShader}
                uniforms={uniforms}
                transparent
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}
