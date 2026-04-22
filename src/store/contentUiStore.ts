import { makeAutoObservable } from "mobx";
import {
    DEFAULT_CONTROL_VALUE,
    INITIAL_CONDITIONS,
} from "../page/Content/constants";
import type { ControlValue, GovernorState } from "../page/Content/types";

export class ContentUiStore {
    isPlay = false;
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
        this.isPlay = value;
    }

    togglePlay() {
        this.setPlay(!this.isPlay);
    }

    setOrbit(value: boolean) {
        this.isOrbit = value;
    }

    setType(value: boolean) {
        this.type = value;
        localStorage.setItem("type", String(value));
    }

    setAParams(value: number) {
        this.aParams = value;
    }

    setF0Params(value: number) {
        this.f0Params = value;
    }

    setMParams(value: number) {
        this.mParams = value;
    }

    setInitialConditions(value: GovernorState) {
        this.initialConditions = value;
    }
}
