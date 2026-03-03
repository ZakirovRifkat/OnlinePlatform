import type { Texture } from "three";

export type BaseMapsProps = {
    colorMap: Texture;
    displacementMap: Texture;
    normalMap: Texture;
    roughnessMap: Texture;
};

export type MaterialMapsProps = BaseMapsProps & {
    Metalness: Texture;
};
