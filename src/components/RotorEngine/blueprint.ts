import type { SceneBlueprint } from "./types";

export const sceneBlueprint: SceneBlueprint = {
    groups: [
        {
            id: "assembly-root",
            position: [0, 0, 0],
        },
        {
            id: "crank-pivot",
            parentGroupId: "assembly-root",
            position: [0, 1.8, 0],
        },
        {
            id: "conrod-pivot",
            parentGroupId: "assembly-root",
            position: [-7.2, 1.8, 0],
        },
    ],
    models: [
        {
            id: "rotor-body",
            url: "/models/rotor_body.glb",
            groupId: "assembly-root",
            position: [0, 0, 0],
            scale: [1, 1, 1],
        },
        {
            id: "rotor-circle",
            url: "/models/rotor_cicle.glb",
            groupId: "crank-pivot",
            dependsOn: ["rotor-body"],
            position: [0, 0, 0],
            scale: [2.3, 1.6, 1.6],
            rotation: [0, -90, 0],
        },
        {
            id: "rotor-conrod",
            url: "/models/rotor_conrod.glb",
            groupId: "conrod-pivot",
            dependsOn: ["rotor-circle"],
            position: [7.2, 0, 0],
            scale: [2, 2, 2],
            rotation: [0, 0, 0],
        },
        {
            id: "rotor-piston",
            url: "/models/rotor_piston.glb",
            groupId: "assembly-root",
            dependsOn: ["rotor-conrod"],
            position: [-7.5, 1.8, 0],
            scale: [2, 2, 2],
            rotation: [90, 0, 0],
        },
    ],
    engineAnimation: {
        enabled: true,
        mode: "auto",
        crankId: "crank-pivot",
        conrodId: "conrod-pivot",
        pistonId: "rotor-piston",
        rpm: -60,
        phaseOffsetDeg: -90,
        crankRotationAxis: "z",
        travelAxis: "x",
        conrodTiltAxis: "z",
        conrodPhaseOffsetDeg: 180,
        conrodHorizontalRange: 1.4,
        pistonHorizontalRange: -1.4,
        conrodTiltMinDeg: 12.5,
        conrodTiltMaxDeg: -9.5,
        conrodTiltDirection: 1,
    },
    // debugMarkers: {
    //     modelIds: ["conrod-pivot"],
    //     size: 0.5,
    //     color: 0xff2d2d,
    // },
};
