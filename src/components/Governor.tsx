import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import Spindle from "./Spindle";
import GoverLink from "./GoverLink";
import Sleeve from "./Sleeve";
import Knuckle from "./Knuckle";

export const Governor = ({ ...props }: any) => {
    const groupRef: any = useRef(null);
    const leftHandleUp: any = useRef(null);
    const rightHandleUp: any = useRef(null);
    const leftHandleDown: any = useRef(null);
    const rightHandleDown: any = useRef(null);
    const sleeveRef: any = useRef(null);
    const stand = new THREE.CylinderGeometry(1, 3, 1, 1024);
    const Metalname = (type: any) => `/Metal/Metal035_1K-JPG_${type}.jpg`;
    const [
        MetalcolorMap,
        MetaldisplacementMap,
        MetalnormalMap,
        MetalroughnessMap,
        Metalness,
    ] = useLoader(TextureLoader, [
        Metalname("Color"),
        Metalname("Displacement"),
        Metalname("NormalDX"),
        Metalname("Roughness"),
        Metalname("Metalness"),
    ]);

    let dAngleUp = 0.2;
    let dAngleDown = 0.301;
    let angleUp = 22.5;
    let angleDown = 27.7;
    let sleeve = -3.3;
    let sleeveSpeed = 0.02465;
    let speedAngle = 3;
    let speed = -0.01;

    useEffect(() => {
        if (props.isModelLoaded && props.play) {
            let index = 0;

            const updateRotation = () => {
                if (index < props.solution.length) {
                    const el = props.solution[index];
                    console.log(el[0]);
                    speed = el[0] / 100;

                    index++;
                    setTimeout(updateRotation, 10); // Рекурсивный вызов с задержкой
                }
            };

            updateRotation(); // Запускаем первый вызов
        }
    }, [props.play]);

    useFrame(() => {
        if (props.isModelLoaded && props.play) {
            angleUp += dAngleUp;
            angleDown += dAngleDown;
            sleeve += sleeveSpeed;
            speedAngle -= speed;
            if (angleUp >= 46.8 || angleUp <= 22.5) {
                dAngleUp = -1 * dAngleUp;
            }
            if (angleDown >= 64.2 || angleDown <= 27.7) {
                dAngleDown = -1 * dAngleDown;
            }
            if (sleeve >= -0.3 || sleeve <= -3.3) {
                sleeveSpeed = -1 * sleeveSpeed;
                speed = -1 * speed;
            }
            groupRef.current.rotation.y += speed;
            leftHandleUp.current.rotation.z = THREE.MathUtils.degToRad(angleUp);
            leftHandleDown.current.rotation.x =
                THREE.MathUtils.degToRad(angleDown);
            sleeveRef.current.position.y = sleeve;

            rightHandleUp.current.rotation.z =
                THREE.MathUtils.degToRad(angleUp);
            rightHandleDown.current.rotation.x = THREE.MathUtils.degToRad(
                -1 * angleDown
            );
        }
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
            console.log("Model is fully loaded");
        }
    });

    if (!props.isModelLoaded) {
        return null;
    }

    return (
        <>
            <group ref={groupRef}>
                {/* Левый  */}
                <group
                    position={[1.05, 4.74, 0]}
                    rotation={[0, 0, Math.PI / 8]}
                    ref={leftHandleUp}
                >
                    <mesh
                        rotation={[0, 0, -Math.PI / 2]}
                        position={[0, 0.07, 0]}
                    >
                        <GoverLink
                            colorMap={MetalcolorMap}
                            displacementMap={MetaldisplacementMap}
                            normalMap={MetalnormalMap}
                            roughnessMap={MetalroughnessMap}
                            Metalness={Metalness}
                        />
                        {/* Сфера */}
                        <mesh
                            rotation={[0, 0, Math.PI / 2]}
                            position={[5.94, 0.5, 0.02]}
                            scale={1}
                            geometry={new THREE.SphereGeometry(0.7, 128, 128)}
                        >
                            <meshStandardMaterial
                                displacementScale={0}
                                color={"yellow"}
                                map={props.colorMap}
                                displacementMap={props.displacementMap}
                                normalMap={props.normalMap}
                                roughnessMap={props.roughnessMap}
                            />
                        </mesh>
                    </mesh>
                </group>
                {/* Правый */}
                <group
                    position={[-1.086, 4.74, 0]}
                    rotation={[0, Math.PI, Math.PI / 8]}
                    ref={rightHandleUp}
                >
                    <mesh
                        rotation={[0, 0, -Math.PI / 2]}
                        position={[0, 0.07, 0]}
                    >
                        <GoverLink
                            colorMap={MetalcolorMap}
                            displacementMap={MetaldisplacementMap}
                            normalMap={MetalnormalMap}
                            roughnessMap={MetalroughnessMap}
                            Metalness={Metalness}
                        />
                        {/* Сфера */}
                        <mesh
                            rotation={[0, 0, Math.PI / 2]}
                            position={[5.94, 0.5, 0.02]}
                            scale={1}
                            geometry={new THREE.SphereGeometry(0.7, 128, 128)}
                        >
                            <meshStandardMaterial
                                displacementScale={0}
                                color={"yellow"}
                                map={props.colorMap}
                                displacementMap={props.displacementMap}
                                normalMap={props.normalMap}
                                roughnessMap={props.roughnessMap}
                            />
                        </mesh>
                    </mesh>
                </group>
                <group
                    ref={sleeveRef}
                    position={[0, -3.3, 0]}
                    // position={[0, -0.3, 0]}
                    rotation={[0, Math.PI / 2, 0]}
                >
                    <mesh>
                        <Sleeve
                            colorMap={MetalcolorMap}
                            displacementMap={MetaldisplacementMap}
                            normalMap={MetalnormalMap}
                            roughnessMap={MetalroughnessMap}
                            Metalness={Metalness}
                        />
                    </mesh>
                    <mesh
                        ref={leftHandleDown}
                        rotation={[Math.PI / 6.6, 0, -Math.PI / 2]}
                        position={[0, -0.06, 1.18]}
                    >
                        <Knuckle
                            colorMap={MetalcolorMap}
                            displacementMap={MetaldisplacementMap}
                            normalMap={MetalnormalMap}
                            roughnessMap={MetalroughnessMap}
                            Metalness={Metalness}
                        />
                    </mesh>
                    <mesh
                        ref={rightHandleDown}
                        rotation={[-Math.PI / 6.6, 0, -Math.PI / 2]}
                        position={[0, -0.06, -1.22]}
                    >
                        <Knuckle
                            colorMap={MetalcolorMap}
                            displacementMap={MetaldisplacementMap}
                            normalMap={MetalnormalMap}
                            roughnessMap={MetalroughnessMap}
                            Metalness={Metalness}
                        />
                    </mesh>
                </group>
                <mesh position={[-5.825, -4.8, 0]}>
                    <Spindle
                        colorMap={MetalcolorMap}
                        displacementMap={MetaldisplacementMap}
                        normalMap={MetalnormalMap}
                        roughnessMap={MetalroughnessMap}
                        Metalness={Metalness}
                    />
                </mesh>
            </group>
            <mesh geometry={stand} position={[0, -4.6, 0]}>
                <meshStandardMaterial
                    displacementScale={0}
                    color={"yellow"}
                    map={props.colorMap}
                    displacementMap={props.displacementMap}
                    normalMap={props.normalMap}
                    roughnessMap={props.roughnessMap}
                />
            </mesh>
        </>
    );
};
