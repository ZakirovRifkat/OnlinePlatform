# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive online laboratory for simulating Watt governor dynamics. A React + Three.js application that visualizes two governor models (classic and servo-motor) with real-time 3D animation and parameter controls. The backend API provides numerical solutions for differential equations modeling governor behavior.

## Development Commands

```bash
# Start development server (runs on http://0.0.0.0:3000)
npm run dev

# Build for production
npm run build

# Lint TypeScript/TSX files
npm run lint

# Preview production build
npm run preview
```

## Architecture

### State Management (MobX)

The application uses MobX for reactive state management with four main stores:

- **ContentUiStore** (`src/store/contentUiStore.ts`): UI state for play/pause, control panels, model type selection, and animation parameters
- **ServoStore** (`src/store/servoStore.ts`): Servo model parameters (A, B, C, delta, initial conditions) with localStorage persistence
- **ContentStore** (`src/store/contentStore.ts`): Context provider combining UI and servo stores
- **WikiStore** (`src/store/wikiStore.ts`): Additional documentation/wiki state

All stores use `makeAutoObservable` with `autoBind: true`. Components observe stores via `observer()` from `mobx-react-lite`.

### API Integration

Backend communication through axios client (`src/api/client.ts`):

- **Base URL**: Configured via `VITE_API_BASE_URL` environment variable (defaults to `http://185.203.241.201`)
- **Endpoints**:
  - `/servomodel` - Servo governor model simulation
  - `/classicmodel` - Classic governor model simulation
- **Request format**: Query parameters serialized with custom `serializeParams()` that handles array parameters
- **Response validation**: `normalizeResponse()` filters non-finite values and ensures data consistency

### Component Structure

**Pages** (`src/page/`):
- `Main.tsx` - Root page with texture loading
- `Content/Content.tsx` - Main application view with model tabs, control panel, and settings panel

**Key Components**:
- `Governor` (`src/components/Governor/`) - Core 3D governor visualization using React Three Fiber
- `GovernorModel` (`src/components/GovernorModel/`) - Wrapper for 3D scene setup
- `SettingsPanel` (`src/components/SettingsPanel/`) - Tabbed panel with parameters, graphics, and info
- `ControlPanel` (`src/components/ControlPanel/`) - Play/pause and orbit controls

**3D Models** (`src/models/`):
- Individual component models: `Spindle`, `EngineGear`, `GovernonGear`, `GovernorLink`, `Knuckle`, `Sleeve`
- Models are loaded as separate components and composed in `Governor.tsx`

### Animation System

The `Governor` component uses `useFrame` hook for animation loop:

1. **Kinematics calculation** (`calculateKinematics` helper) - Computes sleeve position and handle angles based on speed
2. **Playback system** (`useGovernorPlayback` hook) - Manages animation speed and rotor speed refs
3. **Series data** (`useGovernorSeriesData` hook) - Processes solution data for visualization
4. **Frame updates** - Updates rotations, positions, and water level animations each frame

Key refs track state across frames: `speedRef`, `rotorSpeedRef`, `sleeveRef`, `engineGearSpinRef`, `gateRef`.

### Numerical Solutions

Classic model uses local solver (`useGovernorSolution` hook) with system parameters:
- Initial conditions: `[1.0, 0.0, 1.0]` (gamma, gamma_dot, omega)
- System params: `b`, `J`, `beta`, `r`, `gamma0`, `x0`
- Time span: 10000 points over 100 time units

Servo model fetches from backend API with parameters A, B, C, delta, and 4-element initial conditions array.

## Code Conventions

- **TypeScript strict mode** enabled
- **Styled-components** for styling (not CSS modules)
- **File naming**: PascalCase for components, camelCase for utilities
- **Component pattern**: Functional components with hooks, observer wrapper for MobX
- **Type definitions**: Separate `types.ts` files in component directories
- **Constants**: Separate `constants.ts` files for magic numbers and configuration

## Environment Variables

Configure in `.env`:
```
VITE_API_BASE_URL=http://185.203.241.201
```

For local backend development, uncomment the localhost line.

## Important Notes

- **Texture loading**: App waits for all textures (rubber and metal) to load before showing 3D model
- **localStorage**: Servo parameters and model type selection persist across sessions
- **Animation performance**: Uses `useFrame` for 60fps updates, refs prevent unnecessary re-renders
- **Water simulation**: Custom shader materials for animated water in outlet cylinders
- **Model switching**: Changing between classic/servo models resets animation timeline (`playStartedAt`)

## Testing the UI

After making changes to 3D visualization or controls:
1. Start dev server with `npm run dev`
2. Test both model types (classic and servo) via tabs
3. Verify play/pause, orbit controls, and parameter changes
4. Check that charts update correctly in GraphicPanel
5. Ensure water level and gate animations respond to sleeve position
