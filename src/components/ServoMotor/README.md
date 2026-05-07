# Servo Motor Module

This module is portable and can be copied into another project.
It does not create its own scene, camera, or renderer.
It only mounts into an existing `THREE.Scene` or a provided parent object.

## Usage

```ts
import { Scene } from "three";
import { ServoMotor } from "./servo-motor";

const scene = new Scene();

const servo = new ServoMotor({
  scene,
  position: [2, 0, -1],
  rotationDeg: [0, 180, 0],
  scale: 1,
  texturePaths: {
    color: "/textures/servo/color.jpg",
    normal: "/textures/servo/normal.jpg",
    roughness: "/textures/servo/roughness.jpg",
    metalness: "/textures/servo/metalness.jpg",
  },
  motion: {
    spoolAxis: "y",
    chamberAxis: "y",
    tripleTravel: 0.12,
    singleTravel: 0.24,
  },
});

await servo.load();

// External control from your regulator logic
servo.setServoTripleSignal(0.6);
```

## React Component Usage

```tsx
import { ServoMotorComponent } from "./servo-motor";

<ServoMotorComponent
  scene={scene}
  position={[2, 0, -1]}
  rotationDeg={[0, 180, 0]}
  scale={1}
  servoTripleSignal={regulatorSignal}
  texturePaths={{
    color: "/textures/servo/color.jpg",
    normal: "/textures/servo/normal.jpg",
    roughness: "/textures/servo/roughness.jpg",
    metalness: "/textures/servo/metalness.jpg",
  }}
  motion={{
    spoolAxis: "y",
    chamberAxis: "y",
    tripleTravel: 0.12,
    singleTravel: 0.24,
  }}
/>
```

The component mounts into your existing `scene` and renders nothing in React (`return null`).

## External Control

- `setServoTripleSignal(value)` receives value in range `[-1..1]`.
- `servo_triple` moves by `tripleTravel`.
- `servo_single` moves in opposite direction by `singleTravel`.

## Cleanup

```ts
servo.dispose();
```
