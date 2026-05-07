import type { SceneBlueprint } from "./types";

export const leverSceneBlueprint: SceneBlueprint = {
    lever: {
        enabled: true,
        leverId: "lever",
        leftId: "lever_left",
        rightId: "lever_right",
        pivotAxis: "x",
        speed: 0.9,
        minAngleRad: -0.54, // new: lower bound
        maxAngleRad: 0.92, // new: upper bound
        showPivot: false,
    },
    models: [
        {
            id: "lever",
            url: "/models/lever.gltf",
            pivotMode: "bounds-center",
            showOrigin: true,
            position: [0, 0, 0],
            rotationDeg: [0, 0, 0],
            scale: 1,
        },
        {
            id: "lever_left",
            url: "/models/lever_left.gltf",
            showOrigin: true,
            position: [0, 0, 0],
            rotationDeg: [0, 0, 0],
            scale: [1, 1, 1],
            attachment: {
                parentId: "lever",
                parentAnchor: { x: 1, y: 1, z: 1 },
                selfAnchor: { x: "center", y: 0.12, z: "center" },
                offset: [0, 0, 0],
                tiltFactor: 0.9,
            },
        },
        {
            id: "lever_right",
            url: "/models/lever_right.gltf",
            showOrigin: true,
            position: [-0.26, 0, 0],
            rotationDeg: [0, 0, 0],
            scale: [1, 1, 1],
            attachment: {
                parentId: "lever",
                parentAnchor: { x: "max", y: 0.06, z: 0.04 },
                selfAnchor: { x: "center", y: 0.88, z: "center" },
                offset: [0, 0, 0],
                tiltFactor: 0.9,
            },
        },
        {
            id: "rivet_left",
            url: "/models/rivet.gltf",
            parentId: "lever_left",
            position: [0, 0, 0],
            rotationDeg: [0, 0, 0],
            scale: 1,
        },
        {
            id: "rivet_right",
            url: "/models/rivet.gltf",
            parentId: "lever_right",
            position: [0, 0, 0],
            rotationDeg: [0, 0, 0],
            scale: 1,
        },
    ],
};
