import {
    Group,
    Mesh,
    MeshStandardMaterial,
    TextureLoader,
    SRGBColorSpace,
    RepeatWrapping,
    type Object3D,
    type Texture,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type {
    AxisName,
    ServoMotorHandles,
    ServoMotorModelUrls,
    ServoMotorOptions,
    ServoMotorTexturePaths,
    Vec3,
} from "./types";
import * as THREE from "three";

const DEFAULT_URLS: ServoMotorModelUrls = {
    body: "/models/servo_body.gltf",
    triple: "/models/servo_triple.gltf",
    single: "/models/servo_single.gltf",
    rivet: "/models/rivet.gltf",
};

const DEFAULT_TRIPLE_OFFSET: Vec3 = [-0.68, 0, -0.3];
const DEFAULT_SINGLE_OFFSET: Vec3 = [-0.68, -0.4, 1.73];

const toRadians = (deg: number) => (deg * Math.PI) / 180;

const setAxisValue = (
    target: { x: number; y: number; z: number },
    axis: AxisName,
    value: number,
) => {
    target[axis] = value;
};

const toScale = (value: number | Vec3 | undefined): Vec3 => {
    if (typeof value === "number") {
        return [value, value, value];
    }
    return value ?? [1, 1, 1];
};

export class ServoMotor {
    private readonly loader = new GLTFLoader();
    private readonly textureLoader = new TextureLoader();
    private readonly root = new Group();
    private readonly options: ServoMotorOptions;

    private body: Object3D | null = null;
    private triple: Object3D | null = null;
    private single: Object3D | null = null;
    private rivet: Object3D | null = null;

    private tripleBase = { x: 0, y: 0, z: 0 };
    private singleBase = { x: 0, y: 0, z: 0 };
    private textures: Texture[] = [];
    private materials: MeshStandardMaterial[] = [];

    constructor(options: ServoMotorOptions) {
        this.options = options;
        this.root.name = "servo-motor-root";
        this.applyRootTransform();
    }

    async load(): Promise<ServoMotorHandles> {
        const urls = { ...DEFAULT_URLS, ...this.options.modelUrls };

        const [bodyGltf, tripleGltf, singleGltf, rivetGltf] = await Promise.all(
            [
                this.loader.loadAsync(urls.body),
                this.loader.loadAsync(urls.triple),
                this.loader.loadAsync(urls.single),
                this.loader.loadAsync(urls.rivet ?? DEFAULT_URLS.rivet!),
            ],
        );

        this.body = bodyGltf.scene;
        this.triple = tripleGltf.scene;
        this.single = singleGltf.scene;
        this.rivet = rivetGltf.scene;

        this.body.name = "servo-body";
        this.triple.name = "servo-triple";
        this.single.name = "servo-single";
        this.rivet.name = "servo-rivet";

        const tripleOffset =
            this.options.childOffsets?.triple ?? DEFAULT_TRIPLE_OFFSET;
        const singleOffset =
            this.options.childOffsets?.single ?? DEFAULT_SINGLE_OFFSET;

        this.triple.position.set(...tripleOffset);
        this.single.position.set(...singleOffset);

        this.tripleBase = {
            x: this.triple.position.x,
            y: this.triple.position.y,
            z: this.triple.position.z,
        };
        this.singleBase = {
            x: this.single.position.x,
            y: this.single.position.y,
            z: this.single.position.z,
        };

        // Attach rivet to top of triple
        this.rivet.position.set(0, 1.88, 0); // ← Измените позицию [X, Y, Z]
        this.rivet.rotation.set(0, 0, 0); // ← Измените поворот [X, Y, Z] в радианах
        this.rivet.scale.set(0.3, 0.3, 0.3); // ← Измените масштаб [X, Y, Z]
        this.triple.add(this.rivet);

        this.body.add(this.triple);
        this.body.add(this.single);
        this.root.add(this.body);

        if (this.options.texturePaths) {
            await this.applyTextures(this.options.texturePaths);
        }

        (this.options.parent ?? this.options.scene).add(this.root);

        return {
            root: this.root,
            body: this.body,
            triple: this.triple,
            single: this.single,
            rivet: this.rivet,
        };
    }

    setTransform(input: {
        position?: Vec3;
        rotationDeg?: Vec3;
        scale?: number | Vec3;
    }) {
        if (input.position) {
            this.root.position.set(...input.position);
        }
        if (input.rotationDeg) {
            this.root.rotation.set(
                toRadians(input.rotationDeg[0]),
                toRadians(input.rotationDeg[1]),
                toRadians(input.rotationDeg[2]),
            );
        }
        if (input.scale !== undefined) {
            const scale = toScale(input.scale);
            this.root.scale.set(...scale);
        }
    }

    async setTextures(texturePaths: ServoMotorTexturePaths) {
        await this.applyTextures(texturePaths);
    }

    // External control for servo_triple motion. Input signal is expected in [-1..1].
    setServoTripleSignal(signal: number) {
        if (!this.triple) {
            return;
        }

        const clamped = Math.max(-1, Math.min(1, signal));
        const spoolAxis = this.options.motion?.spoolAxis ?? "y";
        const tripleTravel = this.options.motion?.tripleTravel ?? 0.12;

        this.triple.position.set(
            this.tripleBase.x,
            this.tripleBase.y,
            this.tripleBase.z,
        );
        setAxisValue(
            this.triple.position,
            spoolAxis,
            this.tripleBase[spoolAxis] + clamped * tripleTravel,
        );
    }

    // Control servo_single based on lever_right displacement
    setServoSingleFromLeverDisplacement(yDisplacement: number) {
        if (!this.single) {
            return;
        }

        // Scale down the displacement to reduce movement range
        // Adjust this factor to control how much servo_single moves
        const scaleFactor = 0.2; // Try 0.5 for half the movement, adjust as needed

        this.single.position.set(
            this.singleBase.x,
            this.singleBase.y + yDisplacement * scaleFactor,
            this.singleBase.z,
        );
    }

    dispose() {
        this.root.parent?.remove(this.root);
        for (const material of this.materials) {
            material.dispose();
        }
        this.materials = [];

        for (const texture of this.textures) {
            texture.dispose();
        }
        this.textures = [];
    }

    private applyRootTransform() {
        const scale = toScale(this.options.scale);
        this.root.scale.set(...scale);

        if (this.options.position) {
            this.root.position.set(...this.options.position);
        }

        if (this.options.rotationDeg) {
            this.root.rotation.set(
                toRadians(this.options.rotationDeg[0]),
                toRadians(this.options.rotationDeg[1]),
                toRadians(this.options.rotationDeg[2]),
            );
        }
    }

    private async applyTextures(texturePaths: ServoMotorTexturePaths) {
        const maps = await this.loadTextureMaps(texturePaths);

        this.materials.forEach((material) => material.dispose());
        this.materials = [];

        const targets = [this.body, this.triple, this.single].filter(
            (item): item is Object3D => Boolean(item),
        );

        for (const root of targets) {
            const isActuatorPart =
                root.name === "servo-triple" || root.name === "servo-single";

            root.traverse((node) => {
                if (!(node instanceof Mesh)) {
                    return;
                }

                const material = new MeshStandardMaterial({
                    color: isActuatorPart ? 0xaeb4bc : 0xffffff,
                    map: isActuatorPart ? undefined : maps.color,
                    normalMap: maps.normal,
                    roughnessMap: maps.roughness,
                    metalnessMap: maps.metalness,
                    aoMap: maps.ao,
                    metalness: isActuatorPart ? 0.92 : maps.metalness ? 1 : 0.5,
                    roughness: isActuatorPart
                        ? 0.28
                        : maps.roughness
                          ? 1
                          : 0.45,
                });

                node.material = material;
                this.materials.push(material);
            });
        }
    }

    private async loadTextureMaps(paths: ServoMotorTexturePaths) {
        this.textures.forEach((texture) => texture.dispose());
        this.textures = [];

        const load = async (path?: string) => {
            if (!path) {
                return undefined;
            }
            const texture = await this.textureLoader.loadAsync(path);
            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
            texture.repeat.set(1, 1);
            texture.colorSpace = path.includes("color")
                ? SRGBColorSpace
                : texture.colorSpace;
            this.textures.push(texture);
            return texture;
        };

        const [color, normal, roughness, metalness, ao] = await Promise.all([
            load(paths.color),
            load(paths.normal),
            load(paths.roughness),
            load(paths.metalness),
            load(paths.ao),
        ]);

        return { color, normal, roughness, metalness, ao };
    }
}
