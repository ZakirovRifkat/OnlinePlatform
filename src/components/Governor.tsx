import React, {createContext} from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import Spindle from "./Spindle";
import GoverLink from "./GoverLink";
import Sleeve from "./Sleeve";
import Knuckle from "./Knuckle";

export const Governor = ({...props}:any) => {
    const groupRef = useRef(null);
    const leftHandle = useRef(null);
    const rightHandle = useRef(null);

    const stand = new THREE.CylinderGeometry(1, 3, 1, 1024);

    let count = 45;
    let angle = 1;
    useFrame(() => {
        count += angle;

        if (count > 80 || count < 18) {
            angle = -1 * angle;
        }
        // groupRef.current.rotation.y += THREE.MathUtils.degToRad(1);
        // leftHandle.current.rotation.z += THREE.MathUtils.degToRad(angle);
        // rightHandle.current.rotation.z += THREE.MathUtils.degToRad(angle);
        if (
            props.colorMap &&
            props.displacementMap &&
            props.normalMap &&
            props.roughnessMap &&
            !props.isModelLoaded
        ) {
            props.setModelLoaded(true);
            console.log("Model is fully loaded");
        }
    });

    if (!props.isModelLoaded) {
        return null
    }

    return (
        <>
        <group ref={groupRef}>
            {/* Левый  */}
            <group
                position={[1.078, 4.68, 0]}
                rotation={[0, 0, Math.PI / 8]}
                ref={leftHandle}
            >
                <mesh
                    rotation={[0, 0, -Math.PI / 2]}
                    position={[0, 0.07, 0]}
                >
                    <GoverLink />
                    {/* Сфера */}
                    <mesh
                        position={[5.8, 0.5, 0.02]}
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
                position={[-1.14, 4.68, 0]}
                rotation={[0, Math.PI, Math.PI / 8]}
                ref={rightHandle}
            >
                <mesh
                    rotation={[0, 0, -Math.PI / 2]}
                    position={[0, 0.07, 0]}
                >
                    <GoverLink />
                    {/* Сфера */}
                    <mesh
                        position={[5.8, 0.5, 0.02]}
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
                position={[0, -3.24, 0]}
                // position={[0, -0.3, 0]}
                rotation={[0, Math.PI / 2, 0]}
            >
                <mesh>
                    <Sleeve />
                </mesh>
                <mesh
                    rotation={[Math.PI / 6.5, 0, -Math.PI / 2]}
                    position={[0, -0.06, 1.18]}
                >
                    <Knuckle />
                </mesh>
                <mesh
                    rotation={[-Math.PI / 6.5, 0, -Math.PI / 2]}
                    position={[0, -0.06, -1.22]}
                >
                    <Knuckle />
                </mesh>
            </group>
            <mesh position={[-5.85, -4.8, 0]}>
                <Spindle />
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


