import {
    AmbientLight,
    AxesHelper,
    Box3,
    BoxGeometry,
    Clock,
    Color,
    DirectionalLight,
    Group,
    Mesh,
    MeshStandardMaterial,
    PerspectiveCamera,
    RepeatWrapping,
    SRGBColorSpace,
    Scene,
    SphereGeometry,
    Texture,
    TextureLoader,
    Vector3,
    Vector2,
    WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type {
    AxisName,
    DebugMarkerConfig,
    EngineAnimationConfig,
    GroupConfig,
    LoadedNode,
    MetalTexturePaths,
    ModelConfig,
    SceneLoadOptions,
    SceneBlueprint,
    TransformConfig,
    Vec3,
} from "./types";

export interface SceneManagerState {
    loadedNodes: LoadedNode[];
    warnings: string[];
}

export interface SceneManagerOptions {
    mount?: HTMLElement;
    externalScene?: Scene;
    autoFrame?: boolean;
    includeDefaultEnvironment?: boolean;
}

interface EngineAnimationResolvedConfig {
    mode: "auto" | "manual";
    rpm: number;
    crankAngleDeg: number;
    phaseOffsetDeg: number;
    crankRotationAxis: AxisName;
    travelAxis: AxisName;
    conrodTiltAxis: AxisName;
    conrodPhaseOffsetDeg: number;
    conrodHorizontalRange: number;
    pistonHorizontalRange: number;
    conrodTiltRangeDeg: number;
    conrodTiltMinDeg: number;
    conrodTiltMaxDeg: number;
    conrodTiltDirection: 1 | -1;
}

interface EngineAnimationRuntime {
    config: EngineAnimationResolvedConfig;
    phase: number;
    crank: Group | Mesh;
    conrod: Group | Mesh;
    piston: Group | Mesh;
    crankBaseRotation: Vector3;
    conrodBasePosition: Vector3;
    conrodBaseRotation: Vector3;
    pistonBasePosition: Vector3;
}

const setAxisValue = (
    target: { x: number; y: number; z: number },
    axis: AxisName,
    value: number,
) => {
    target[axis] = value;
};

const toRadians = (value: number) => (value * Math.PI) / 180;

const applyTransform = (
    target: Group | Mesh | Scene,
    transform: TransformConfig,
) => {
    if (transform.position) {
        target.position.set(...transform.position);
    }

    if (transform.rotation) {
        // Rotation config is expressed in degrees for easier editing.
        target.rotation.set(
            toRadians(transform.rotation[0]),
            toRadians(transform.rotation[1]),
            toRadians(transform.rotation[2]),
        );
    }

    if (transform.scale) {
        target.scale.set(...transform.scale);
    }
};

const topologicalSort = <T extends { id: string; dependsOn?: string[] }>(
    items: T[],
): T[] => {
    const nodes = new Map(items.map((item) => [item.id, item]));
    const permanent = new Set<string>();
    const temporary = new Set<string>();
    const order: T[] = [];

    const visit = (id: string) => {
        if (permanent.has(id)) {
            return;
        }

        if (temporary.has(id)) {
            throw new Error(`Dependency cycle detected around "${id}"`);
        }

        const item = nodes.get(id);
        if (!item) {
            throw new Error(`Unknown dependency "${id}"`);
        }

        temporary.add(id);
        for (const dep of item.dependsOn ?? []) {
            visit(dep);
        }

        temporary.delete(id);
        permanent.add(id);
        order.push(item);
    };

    for (const item of items) {
        visit(item.id);
    }

    return order;
};

const createFallbackMesh = (id: string) => {
    const material = new MeshStandardMaterial({
        color: 0xc97f4a,
        roughness: 0.55,
        metalness: 0.1,
    });

    const mesh = new Mesh(new BoxGeometry(0.5, 0.5, 0.5), material);
    mesh.name = `${id}-fallback`;
    return mesh;
};

const stylePalette = [
    { base: "#ffffff", accent: "#ffffff", metalness: 0.9, roughness: 5 },
    { base: "#ffffff", accent: "#ada68f", metalness: 0.86, roughness: 0.32 },
    { base: "#e1e1e1", accent: "#b9b9b9", metalness: 0.86, roughness: 0.32 },
    { base: "#ffffff", accent: "#ffffff", metalness: 0.89, roughness: 10 },
];

const modelMaterialOverrides: Record<
    string,
    { base: string; accent: string; metalness: number; roughness: number }
> = {
    "rotor-body": {
        base: "#ffffff",
        accent: "#d9d9d9",
        metalness: 0.9,
        roughness: 0.2,
    },
    "rotor-circle": {
        base: "#aeb4bc",
        accent: "#aeb4bc",
        metalness: 0.92,
        roughness: 0.28,
    },
    "rotor-conrod": {
        base: "#aeb4bc",
        accent: "#aeb4bc",
        metalness: 0.92,
        roughness: 0.28,
    },
    "rotor-piston": {
        base: "#aeb4bc",
        accent: "#aeb4bc",
        metalness: 0.92,
        roughness: 0.28,
    },
};

const grayMetalRotorIds = new Set([
    "rotor-circle",
    "rotor-conrod",
    "rotor-piston",
]);

const toScaleVec = (value: number | Vec3 | undefined): Vec3 => {
    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value === "number") {
        return [value, value, value];
    }

    return [1, 1, 1];
};

const mulVec = (input: Vec3 | undefined, by: Vec3): Vec3 | undefined => {
    if (!input) {
        return undefined;
    }

    return [input[0] * by[0], input[1] * by[1], input[2] * by[2]];
};

const nameHash = (value: string) => {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
        hash = (hash * 31 + value.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
};

const resolveModelDependencies = (
    models: ModelConfig[],
): { orderedModels: ModelConfig[]; warnings: string[] } => {
    const modelIds = new Set(models.map((model) => model.id));
    const warnings: string[] = [];

    const normalized = models.map((model) => {
        const inferredDependencies = [model.parentId].filter(
            (value): value is string => Boolean(value),
        );

        const explicitDependencies = (model.dependsOn ?? []).filter((dep) => {
            const exists = modelIds.has(dep);
            if (!exists) {
                warnings.push(
                    `Model "${model.id}" references unknown dependency "${dep}"`,
                );
            }
            return exists;
        });

        return {
            ...model,
            dependsOn: Array.from(
                new Set([...explicitDependencies, ...inferredDependencies]),
            ),
        };
    });

    return {
        orderedModels: topologicalSort(normalized),
        warnings,
    };
};

export class SceneManager {
    private readonly scene: Scene;
    private readonly camera: PerspectiveCamera | null;
    private readonly renderer: WebGLRenderer | null;
    private readonly controls: OrbitControls | null;
    private readonly loader = new GLTFLoader();
    private readonly textureLoader = new TextureLoader();
    private readonly clock = new Clock();
    private readonly resizeObserver: ResizeObserver | null;
    private readonly mount: HTMLElement | null;
    private readonly autoFrame: boolean;

    private readonly groupMap = new Map<string, Group>();
    private readonly modelMap = new Map<string, LoadedNode>();
    private readonly materialCache = new Map<string, MeshStandardMaterial>();
    private activeTextureKey = "";
    private metalTextureSet: {
        color?: Texture;
        normal?: Texture;
        roughness?: Texture;
        metalness?: Texture;
        displacement?: Texture;
    } | null = null;
    private engineAnimationRuntime: EngineAnimationRuntime | null = null;
    private rotationSpeedFactor = 0;
    private frameId = 0;

    constructor(input: HTMLElement | SceneManagerOptions) {
        const options: SceneManagerOptions =
            input instanceof HTMLElement ? { mount: input } : input;

        this.mount = options.mount ?? null;
        this.scene = options.externalScene ?? new Scene();
        this.autoFrame = options.autoFrame ?? !options.externalScene;

        const includeDefaultEnvironment =
            options.includeDefaultEnvironment ?? !options.externalScene;

        if (this.mount) {
            this.scene.background = null;

            this.camera = new PerspectiveCamera(55, 1, 0.1, 200);
            this.camera.position.set(3.5, 2.7, 5);

            this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.renderer.setClearColor(new Color("#000000"), 0);
            this.mount.append(this.renderer.domElement);

            this.controls = new OrbitControls(
                this.camera,
                this.renderer.domElement,
            );
            this.controls.enableDamping = true;
            this.controls.target.set(0, 1.1, 0);

            this.resizeObserver = new ResizeObserver(() => this.resize());
            this.resizeObserver.observe(this.mount);
            this.resize();
        } else {
            this.camera = null;
            this.renderer = null;
            this.controls = null;
            this.resizeObserver = null;
        }

        if (includeDefaultEnvironment) {
            this.scene.add(new AmbientLight(0xffffff, 0.8));

            const keyLight = new DirectionalLight(0xfff0cb, 1.15);
            keyLight.position.set(4, 7, 5);
            this.scene.add(keyLight);

            const rimLight = new DirectionalLight(0xf1f1f1, 0.62);
            rimLight.position.set(-5, 4, -3);
            this.scene.add(rimLight);

            const fillLight = new DirectionalLight(0xfff4dc, 0.45);
            fillLight.position.set(0, 3, -6);
            this.scene.add(fillLight);

            this.scene.add(new AxesHelper(1.2));
        }

        if (this.autoFrame) {
            this.animate();
        }
    }

    async loadBlueprint(
        blueprint: SceneBlueprint,
        options?: SceneLoadOptions,
    ): Promise<SceneManagerState> {
        this.rotationSpeedFactor =
            options?.rotationSpeedFactor ?? this.rotationSpeedFactor;
        this.clearDynamicContent();

        const warnings: string[] = [];
        const preparedBlueprint = this.prepareBlueprint(blueprint, options);

        try {
            await this.ensureMetalTexturesLoaded(options?.texturePaths);
        } catch {
            warnings.push(
                "Texture maps could not be loaded, continuing without them",
            );
        }

        const sortedGroups = topologicalSort(
            preparedBlueprint.groups.map((group: GroupConfig) => ({
                ...group,
                dependsOn: group.parentGroupId ? [group.parentGroupId] : [],
            })),
        );

        for (const groupConfig of sortedGroups) {
            const group = new Group();
            group.name = groupConfig.id;
            applyTransform(group, groupConfig);

            const parent = groupConfig.parentGroupId
                ? this.groupMap.get(groupConfig.parentGroupId)
                : this.scene;

            if (!parent) {
                warnings.push(
                    `Group "${groupConfig.id}" has missing parent "${groupConfig.parentGroupId}"`,
                );
                this.scene.add(group);
            } else {
                parent.add(group);
            }

            this.groupMap.set(groupConfig.id, group);
        }

        const { orderedModels, warnings: dependencyWarnings } =
            resolveModelDependencies(preparedBlueprint.models);
        warnings.push(...dependencyWarnings);

        for (const modelConfig of orderedModels) {
            const loaded = await this.loadModel(modelConfig, warnings);
            this.modelMap.set(modelConfig.id, loaded);
        }

        this.setupEngineAnimation(preparedBlueprint.engineAnimation, warnings);
        this.attachDebugMarkers(preparedBlueprint.debugMarkers, warnings);
        this.clock.start();

        this.frameLoadedContent();

        return {
            loadedNodes: [...this.modelMap.values()],
            warnings,
        };
    }

    dispose() {
        cancelAnimationFrame(this.frameId);
        this.controls?.dispose();
        this.resizeObserver?.disconnect();
        this.renderer?.dispose();

        if (this.mount && this.renderer) {
            this.mount.removeChild(this.renderer.domElement);
        }
    }

    tick(deltaSeconds: number) {
        this.updateEngineAnimation(deltaSeconds);
    }

    setRotationSpeedFactor(value: number) {
        this.rotationSpeedFactor = Number.isFinite(value) ? value : 1;
    }

    private resize() {
        if (!this.mount || !this.camera || !this.renderer) {
            return;
        }

        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;
        if (!width || !height) {
            return;
        }

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    private animate = () => {
        this.frameId = requestAnimationFrame(this.animate);
        this.tick(this.clock.getDelta());

        if (!this.controls || !this.renderer || !this.camera) {
            return;
        }

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    };

    private clearDynamicContent() {
        this.engineAnimationRuntime = null;

        for (const model of this.modelMap.values()) {
            model.object.parent?.remove(model.object);
        }

        for (const group of this.groupMap.values()) {
            group.parent?.remove(group);
        }

        this.modelMap.clear();
        this.groupMap.clear();
    }

    private async loadModel(
        model: ModelConfig,
        warnings: string[],
    ): Promise<LoadedNode> {
        let modelRoot: Group | Mesh;
        let isFallback = false;

        try {
            const gltf = await this.loader.loadAsync(model.url);
            modelRoot = gltf.scene;
        } catch (error) {
            isFallback = true;
            modelRoot = createFallbackMesh(model.id);
            warnings.push(
                `Model "${model.id}" could not be loaded from "${model.url}"`,
            );
            console.warn(error);
        }

        this.applyIndustrialStyle(modelRoot, model.id);
        modelRoot.name = model.id;
        applyTransform(modelRoot, model);

        const parent = this.resolveParent(model);
        parent.add(modelRoot);

        return {
            id: model.id,
            object: modelRoot,
            sourceUrl: model.url,
            isFallback,
        };
    }

    private applyIndustrialStyle(root: Group | Mesh, modelId: string) {
        root.traverse((node) => {
            if (!(node instanceof Mesh)) {
                return;
            }

            const key = `${modelId}:${node.name || "mesh"}`;
            const cached = this.materialCache.get(key);
            if (cached) {
                node.material = cached;
                return;
            }

            const palette =
                modelMaterialOverrides[modelId] ??
                stylePalette[nameHash(key) % stylePalette.length];
            const textures = this.metalTextureSet;
            const useBodyTextureMaps = modelId === "rotor-body";
            const useGrayMetalTextureMaps = grayMetalRotorIds.has(modelId);

            const material = new MeshStandardMaterial({
                color: new Color(palette.base),
                map: useBodyTextureMaps ? textures?.color : undefined,
                normalMap:
                    useBodyTextureMaps || useGrayMetalTextureMaps
                        ? textures?.normal
                        : undefined,
                roughnessMap:
                    useBodyTextureMaps || useGrayMetalTextureMaps
                        ? textures?.roughness
                        : undefined,
                metalnessMap:
                    useBodyTextureMaps || useGrayMetalTextureMaps
                        ? textures?.metalness
                        : undefined,
                displacementMap: useBodyTextureMaps
                    ? textures?.displacement
                    : undefined,
                displacementScale: useBodyTextureMaps && textures ? 0.015 : 0,
                metalness: palette.metalness,
                roughness: palette.roughness,
                envMapIntensity: 1.2,
            });

            this.materialCache.set(key, material);
            node.material = material;
        });
    }

    private async ensureMetalTexturesLoaded(
        texturePaths?: Partial<MetalTexturePaths>,
    ) {
        const textureKey = JSON.stringify(texturePaths ?? null);

        if (textureKey !== this.activeTextureKey) {
            this.activeTextureKey = textureKey;
            this.metalTextureSet = null;
            this.materialCache.clear();
        }

        if (this.metalTextureSet) {
            return;
        }

        if (!texturePaths) {
            return;
        }

        const entries = Object.entries(texturePaths).filter(
            (entry): entry is [keyof MetalTexturePaths, string] =>
                typeof entry[1] === "string" && entry[1].length > 0,
        );

        if (entries.length === 0) {
            return;
        }

        const textures: Partial<Record<keyof MetalTexturePaths, Texture>> = {};

        await Promise.all(
            entries.map(async ([key, path]) => {
                const texture = await this.textureLoader.loadAsync(path);
                texture.wrapS = RepeatWrapping;
                texture.wrapT = RepeatWrapping;
                texture.repeat.set(2, 2);
                texture.needsUpdate = true;

                if (key === "color") {
                    texture.colorSpace = SRGBColorSpace;
                }

                textures[key] = texture;
            }),
        );

        this.metalTextureSet = textures;
    }

    private prepareBlueprint(
        blueprint: SceneBlueprint,
        options?: SceneLoadOptions,
    ): SceneBlueprint {
        const scale = toScaleVec(options?.globalScale);

        const nextBlueprint: SceneBlueprint = {
            ...blueprint,
            groups: blueprint.groups.map((group) => ({
                ...group,
                position: mulVec(group.position, scale),
                scale: mulVec(group.scale, scale),
            })),
            models: blueprint.models.map((model) => ({
                ...model,
                position: mulVec(model.position, scale),
                scale: mulVec(model.scale, scale),
            })),
        };

        if (blueprint.engineAnimation) {
            const uniformScale = (scale[0] + scale[1] + scale[2]) / 3;
            nextBlueprint.engineAnimation = {
                ...blueprint.engineAnimation,
                conrodHorizontalRange:
                    (blueprint.engineAnimation.conrodHorizontalRange ?? 0) *
                    uniformScale,
                pistonHorizontalRange:
                    (blueprint.engineAnimation.pistonHorizontalRange ?? 0) *
                    uniformScale,
            };
        }

        if (blueprint.debugMarkers) {
            const uniformScale = (scale[0] + scale[1] + scale[2]) / 3;
            nextBlueprint.debugMarkers = {
                ...blueprint.debugMarkers,
                size: (blueprint.debugMarkers.size ?? 0.06) * uniformScale,
            };
        }

        return nextBlueprint;
    }

    private resolveParent(model: ModelConfig): Scene | Group | Mesh {
        if (model.parentId) {
            const modelParent = this.modelMap.get(model.parentId)?.object;
            if (modelParent) {
                return modelParent as Group | Mesh;
            }
        }

        if (model.groupId) {
            const groupParent = this.groupMap.get(model.groupId);
            if (groupParent) {
                return groupParent;
            }
        }

        return this.scene;
    }

    private setupEngineAnimation(
        config: EngineAnimationConfig | undefined,
        warnings: string[],
    ) {
        if (!config || config.enabled === false) {
            this.engineAnimationRuntime = null;
            return;
        }

        const crank =
            this.modelMap.get(config.crankId)?.object ??
            this.groupMap.get(config.crankId);
        const conrod =
            this.modelMap.get(config.conrodId)?.object ??
            this.groupMap.get(config.conrodId);
        const piston =
            this.modelMap.get(config.pistonId)?.object ??
            this.groupMap.get(config.pistonId);

        if (!crank || !conrod || !piston) {
            warnings.push(
                "Engine animation is disabled because one or more target ids are missing",
            );
            this.engineAnimationRuntime = null;
            return;
        }

        const resolvedConfig: EngineAnimationResolvedConfig = {
            mode: config.mode ?? "auto",
            rpm: config.rpm ?? 90,
            crankAngleDeg: config.crankAngleDeg ?? 0,
            phaseOffsetDeg: config.phaseOffsetDeg ?? 0,
            crankRotationAxis: config.crankRotationAxis ?? "z",
            travelAxis: config.travelAxis ?? "x",
            conrodTiltAxis: config.conrodTiltAxis ?? "z",
            conrodPhaseOffsetDeg: config.conrodPhaseOffsetDeg ?? 0,
            conrodHorizontalRange: config.conrodHorizontalRange ?? 1,
            pistonHorizontalRange: config.pistonHorizontalRange ?? 1,
            conrodTiltRangeDeg: config.conrodTiltRangeDeg ?? 16,
            conrodTiltMinDeg:
                config.conrodTiltMinDeg ?? -(config.conrodTiltRangeDeg ?? 16),
            conrodTiltMaxDeg:
                config.conrodTiltMaxDeg ?? config.conrodTiltRangeDeg ?? 16,
            conrodTiltDirection: config.conrodTiltDirection ?? 1,
        };

        this.engineAnimationRuntime = {
            config: resolvedConfig,
            phase: 0,
            crank: crank as Group | Mesh,
            conrod: conrod as Group | Mesh,
            piston: piston as Group | Mesh,
            crankBaseRotation: new Vector3(
                crank.rotation.x,
                crank.rotation.y,
                crank.rotation.z,
            ),
            conrodBasePosition: conrod.position.clone(),
            conrodBaseRotation: new Vector3(
                conrod.rotation.x,
                conrod.rotation.y,
                conrod.rotation.z,
            ),
            pistonBasePosition: piston.position.clone(),
        };
    }

    private updateEngineAnimation(deltaSeconds: number) {
        const runtime = this.engineAnimationRuntime;
        if (!runtime) {
            return;
        }

        let phase: number;
        if (runtime.config.mode === "manual") {
            phase =
                toRadians(runtime.config.crankAngleDeg) +
                toRadians(runtime.config.phaseOffsetDeg);
            runtime.phase = phase;
        } else {
            const angularVelocity =
                (runtime.config.rpm * this.rotationSpeedFactor * 2 * Math.PI) /
                60;
            runtime.phase =
                (runtime.phase + angularVelocity * deltaSeconds) %
                (2 * Math.PI);
            phase = runtime.phase + toRadians(runtime.config.phaseOffsetDeg);
        }

        const harmonic = Math.sin(phase);
        const conrodHarmonic = Math.sin(
            phase + toRadians(runtime.config.conrodPhaseOffsetDeg),
        );

        runtime.crank.rotation.set(
            runtime.crankBaseRotation.x,
            runtime.crankBaseRotation.y,
            runtime.crankBaseRotation.z,
        );
        setAxisValue(
            runtime.crank.rotation,
            runtime.config.crankRotationAxis,
            runtime.crankBaseRotation[runtime.config.crankRotationAxis] + phase,
        );

        runtime.conrod.position.copy(runtime.conrodBasePosition);
        setAxisValue(
            runtime.conrod.position,
            runtime.config.travelAxis,
            runtime.conrodBasePosition[runtime.config.travelAxis] +
                conrodHarmonic * runtime.config.conrodHorizontalRange,
        );

        runtime.conrod.rotation.set(
            runtime.conrodBaseRotation.x,
            runtime.conrodBaseRotation.y,
            runtime.conrodBaseRotation.z,
        );

        // Conrod tilt should be 0 at piston extremes and reach min/max at center.
        const conrodCenterSignal = Math.cos(
            phase + toRadians(runtime.config.conrodPhaseOffsetDeg),
        );

        const conrodTiltDeg =
            conrodCenterSignal >= 0
                ? conrodCenterSignal * runtime.config.conrodTiltMaxDeg
                : -conrodCenterSignal * runtime.config.conrodTiltMinDeg;

        setAxisValue(
            runtime.conrod.rotation,
            runtime.config.conrodTiltAxis,
            runtime.conrodBaseRotation[runtime.config.conrodTiltAxis] +
                toRadians(conrodTiltDeg * runtime.config.conrodTiltDirection),
        );

        runtime.piston.position.copy(runtime.pistonBasePosition);
        setAxisValue(
            runtime.piston.position,
            runtime.config.travelAxis,
            runtime.pistonBasePosition[runtime.config.travelAxis] +
                harmonic * runtime.config.pistonHorizontalRange,
        );
    }

    private attachDebugMarkers(
        config: DebugMarkerConfig | undefined,
        warnings: string[],
    ) {
        if (!config) {
            return;
        }

        const markerSize = config.size ?? 0.06;
        const markerColor = config.color ?? 0xff2d2d;

        for (const modelId of config.modelIds) {
            const node =
                this.modelMap.get(modelId)?.object ??
                this.groupMap.get(modelId);
            if (!node) {
                warnings.push(`Debug marker target "${modelId}" not found`);
                continue;
            }

            const centerMarker = new Mesh(
                new SphereGeometry(markerSize, 14, 10),
                new MeshStandardMaterial({
                    color: markerColor,
                    emissive: markerColor,
                    emissiveIntensity: 0.2,
                }),
            );

            centerMarker.name = `${modelId}-center-marker`;
            centerMarker.position.set(0, 0, 0);
            node.add(centerMarker);

            const axisMarker = new AxesHelper(markerSize * 4);
            axisMarker.name = `${modelId}-axis-marker`;
            node.add(axisMarker);
        }
    }

    private frameLoadedContent() {
        if (!this.camera || !this.controls) {
            return;
        }

        const nodes = [...this.modelMap.values()].map((entry) => entry.object);
        if (nodes.length === 0) {
            return;
        }

        const bounds = new Box3();
        for (const node of nodes) {
            bounds.expandByObject(node);
        }

        if (bounds.isEmpty()) {
            return;
        }

        const center = new Vector3();
        const size = new Vector3();
        bounds.getCenter(center);
        bounds.getSize(size);

        const maxSize = Math.max(size.x, size.y, size.z);
        const fitHeightDistance =
            maxSize / (2 * Math.tan((Math.PI * this.camera.fov) / 360));
        const distance = Math.max(fitHeightDistance * 1.6, 2.2);

        this.controls.target.copy(center);
        this.camera.position.set(
            center.x + distance,
            center.y + distance * 0.6,
            center.z + distance,
        );
        this.camera.near = Math.max(distance / 500, 0.01);
        this.camera.far = Math.max(distance * 12, 100);
        this.camera.updateProjectionMatrix();
        this.controls.update();
    }

    getPointerNdc(pointerX: number, pointerY: number): Vector2 {
        if (!this.renderer) {
            throw new Error(
                "Pointer conversion is unavailable without renderer",
            );
        }

        const rect = this.renderer.domElement.getBoundingClientRect();
        const x = ((pointerX - rect.left) / rect.width) * 2 - 1;
        const y = -((pointerY - rect.top) / rect.height) * 2 + 1;
        return new Vector2(x, y);
    }
}
