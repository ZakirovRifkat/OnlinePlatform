import { makeAutoObservable } from "mobx";
import {
    DEFAULT_CONTROL_VALUE,
    INITIAL_CONDITIONS,
} from "../page/Content/constants";
import type { ControlValue, GovernorState } from "../page/Content/types";

export class ContentUiStore {
    isPlay = false;
    playStartedAt: number | null = null;
    controlValue: ControlValue = DEFAULT_CONTROL_VALUE;
    isOrbit = false;
    type = false;

    aParams = 0.1;
    f0Params = 0.0;
    mParams = 1.0;
    initialConditions: GovernorState = INITIAL_CONDITIONS;

    constructor() {
        this.type = localStorage.getItem("type") === "true";
        makeAutoObservable(this, {}, { autoBind: true });
    }

    setControl(value: ControlValue) {
        this.controlValue = value;
    }

    toggleControl(value: "params" | "graphic") {
        this.setControl(this.controlValue === value ? null : value);
    }

    setPlay(value: boolean) {
        const wasPlaying = this.isPlay;
        this.isPlay = value;

        if (value && !wasPlaying) {
            this.playStartedAt = Date.now();
            return;
        }

        if (!value) {
            this.playStartedAt = null;
        }
    }

    togglePlay() {
        this.setPlay(!this.isPlay);
    }

    setOrbit(value: boolean) {
        this.isOrbit = value;
    }

    setType(value: boolean) {
        const hasChanged = this.type !== value;
        this.type = value;
        localStorage.setItem("type", String(value));

        if (!hasChanged) {
            return;
        }

        // On model switch, restart chart timeline from t=0.
        this.playStartedAt = this.isPlay ? Date.now() : null;
    }

    setAParams(value: number) {
        if (!Number.isFinite(value)) {
            return;
        }
        this.aParams = value;
    }

    setF0Params(value: number) {
        if (!Number.isFinite(value)) {
            return;
        }
        this.f0Params = value;
    }

    setMParams(value: number) {
        if (!Number.isFinite(value)) {
            return;
        }
        this.mParams = value;
    }

    setInitialConditions(value: GovernorState) {
        if (!value.every((item) => Number.isFinite(item))) {
            return;
        }
        this.initialConditions = value;
    }
}
