import type { MaterialMapsProps } from "./types";

type MappedMaterial = {
    displacementScale: number;
    map: unknown;
    displacementMap: unknown;
    normalMap: unknown;
    roughnessMap: unknown;
    metalnessMap: unknown;
};

export const applyMaterialMaps = (
    material: MappedMaterial,
    maps: MaterialMapsProps,
) => {
    material.displacementScale = 0;
    material.map = maps.colorMap;
    material.displacementMap = maps.displacementMap;
    material.normalMap = maps.normalMap;
    material.roughnessMap = maps.roughnessMap;
    material.metalnessMap = maps.Metalness;
};
