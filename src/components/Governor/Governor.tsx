import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo, useRef } from "react";
import type { MutableRefObject, RefObject } from "react";
import { TextureLoader } from "three";
import Spindle from "../../models/Spindle";
import GovernorLink from "../../models/GovernorLink";
import Sleeve from "../../models/Sleeve";
import Knuckle from "../../models/Knuckle";
import type { GovernorProps } from "./types";
import { METAL_TEXTURE_TYPES, STAND_GEOMETRY_ARGS } from "./constants";
import { calculateKinematics, metalTextureName } from "./helpers";
import { useGovernorPlayback } from "./hooks/useGovernorPlayback";
import { useGovernorSeriesData } from "./hooks/useGovernorSeriesData";

export const Governor = (props: GovernorProps) => {
    const groupRef = useRef<THREE.Group | null>(null);
    const leftHandleUp = useRef<THREE.Group | null>(null);
    const rightHandleUp = useRef<THREE.Group | null>(null);
    const leftHandleDown = useRef<THREE.Mesh | null>(null);
    const rightHandleDown = useRef<THREE.Mesh | null>(null);
    const sleeveRef = useRef<THREE.Group | null>(null);
    const stand = useMemo(
        () => new THREE.CylinderGeometry(...STAND_GEOMETRY_ARGS),
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

    useFrame(() => {
        // Основной цикл кадра: обновляем анимацию только когда модель загружена и включено воспроизведение.
        if (props.isModelLoaded && props.play) {
            // Защита от обращения к ref до инициализации объектов сцены.
            if (
                !groupRef.current ||
                !leftHandleUp.current ||
                !rightHandleUp.current ||
                !leftHandleDown.current ||
                !rightHandleDown.current ||
                !sleeveRef.current
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

            // Смещаем ползунок по оси Y.
            sleeveRef.current.position.y = speedSleeve;

            rightHandleUp.current.rotation.z =
                THREE.MathUtils.degToRad(angleUp);
            rightHandleDown.current.rotation.x = THREE.MathUtils.degToRad(
                -1 * angleDown,
            );
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
                </group>
                {/* Стержень */}
                <mesh position={[-5.825, -4.8, 0]}>
                    <Spindle {...metalMaps} />
                </mesh>
            </group>
            {/* Подставка */}
            <mesh geometry={stand} position={[0, -4.6, 0]}>
                <meshStandardMaterial
                    displacementScale={0}
                    color={"yellow"}
                    {...standMaterialMaps}
                />
            </mesh>
        </>
    );
};
