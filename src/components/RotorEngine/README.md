# Engine Component Package

Copy this folder into another React + TypeScript project to reuse the engine scene.

## Included files

- RotorEngine.tsx
- sceneManager.ts
- blueprint.ts
- types.ts
- index.ts

## Required runtime assets

Place your files in the target project public folder:

- /models/*.glb

Texture maps are optional, but there are no built-in defaults anymore.
If you want PBR maps, pass explicit paths through `texturePaths`.

## Minimal usage

```tsx
import { RotorEngine, sceneBlueprint } from "./engine-component";

<RotorEngine
  className="viewport"
  blueprint={sceneBlueprint}
  rotationSpeedFactor={1}
  scale={1}
  texturePaths={{
    color: "/textures/metal/custom_color.jpg",
    normal: "/textures/metal/custom_normal.jpg",
    roughness: "/textures/metal/custom_roughness.jpg",
    metalness: "/textures/metal/custom_metalness.jpg",
    displacement: "/textures/metal/custom_displacement.jpg",
  }}
/>
```

## Required dependencies

- three
- react
- react-dom

Optional examples imports from three/examples are used internally by sceneManager.
