import { useFrame, useLoader } from "@react-three/fiber";
import { Text } from "@react-three/drei";
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

    const showPivotHelper = false;

    const engineShaftGeometry = useMemo(
        () => new THREE.CylinderGeometry(0.6, 0.6, 3, 128, 96),
        [],
    );
    const engineBlockGeometry = useMemo(
        () => new THREE.BoxGeometry(3.4, 4, 4),
        [],
    );
    const engineOutletLength = 3.4;
    const engineOutletCenterY = -8.2;
    const gateHeight = 0.15;
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

    const sleeveRimGeometry = useMemo(
        () => new THREE.TorusGeometry(1, 0.06, 32, 96),
        [],
    );
    const sleeveBallGeometry = useMemo(
        () => new THREE.SphereGeometry(0.16, 64, 64),
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
                    geometry={new THREE.SphereGeometry(0.7, 128, 128)}
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
        if (!props.play) {
            gateBaseWorldPosRef.current = null;
            gateBaseSliderProgressRef.current = null;
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

            // Вращаем главный узел: для сервомотора используется отдельная скорость ротора.
            if (!props.type) {
                groupRef.current.rotation.y += speedRef.current;
            } else {
                groupRef.current.rotation.y += rotorSpeedRef.current / 2;
            }

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
                    if (!gateBaseWorldPosRef.current) {
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
                    const targetGateOffsetY =
                        (baseSliderProgress - sliderTopProgress) * gateTravel;

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

            sleeveKnucklePivotRef.current.rotation.z =
                -1 * THREE.MathUtils.degToRad(angleUp) + 1.96349540849;

            rightHandleUp.current.rotation.z =
                THREE.MathUtils.degToRad(angleUp);
            rightHandleDown.current.rotation.x = THREE.MathUtils.degToRad(
                -1 * angleDown,
            );

            if (engineGearSpinRef.current) {
                engineGearSpinRef.current.rotation.y += speedRef.current;

                const shaftTextureOffset =
                    (engineShaftStripeTexture.offset.x + speedRef.current * 6) %
                    1;
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
                position={[5.3, -3.8, 0]}
                rotation={[0, 0, Math.PI / 2]}
            >
                {showPivotHelper && (
                    <>
                        <axesHelper args={[1.2]} />
                        <mesh>
                            <sphereGeometry args={[0.09, 24, 24]} />
                            <meshBasicMaterial color={"#ff00ff"} />
                        </mesh>
                    </>
                )}
                <mesh>
                    <cylinderGeometry args={[0.14, 0.14, 10, 32]} />
                    <meshStandardMaterial
                        color={"#b8bec8"}
                        metalness={0.85}
                        roughness={0.3}
                    />
                </mesh>
            </group>
            <group position={[0.218, -7.58, 0]} rotation={[0, 0, Math.PI / 2]}>
                <group ref={engineGearSpinRef}>
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

                <mesh geometry={engineBlockGeometry} position={[0, -4.7, 0]}>
                    <meshStandardMaterial
                        color={"#8b929b"}
                        metalness={0.88}
                        roughness={0.34}
                    />
                </mesh>

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

                    {/* Вода */}
                    <WaterHalf
                        position={[-0.78, 0, -0.23]}
                        scaleRef={rightRef}
                        initialScale={1}
                    />
                </group>

                {/* Заслонка между блоками воды */}
                <group ref={gateRef} position={[2.2, -10.25, -0.24]}>
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[3.6, gateHeight, 0.95]} />
                        <meshStandardMaterial
                            displacementScale={0}
                            color={"#b8bec8"}
                            metalness={0.88}
                            roughness={0.34}
                            {...standMaterialMaps}
                        />
                    </mesh>
                </group>

                {/* Второй цилиндр */}
                <group
                    position={[0, engineOutletCenterY - engineOutletLength, 0]}
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

                    {/* Вода */}
                    <WaterHalf
                        position={[-0.78, -0.6, -0.23]}
                        scaleRef={leftRef}
                        initialScale={1}
                    />
                </group>

                <Text
                    font="/fonts/Cormorant-Bold.ttf"
                    position={[0, -4.7, 2.01]}
                    rotation={[0, 0, -Math.PI / 2]}
                    fontSize={0.7}
                    color={"#f2f2f2"}
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={2.8}
                    textAlign="center"
                >
                    {"Паровой двигатель"}
                </Text>
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
