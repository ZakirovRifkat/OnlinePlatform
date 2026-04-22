import { makeAutoObservable } from "mobx";

const getStorageNumber = (key: string, fallback: number) => {
    const raw = localStorage.getItem(key);
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const getStorageString = (key: string, fallback: string) =>
    localStorage.getItem(key) ?? fallback;

const parseInitial = (value: string) => {
    const parsed = value
        .split(";")
        .map((item) => Number(item.trim()))
        .filter((item) => Number.isFinite(item));

    if (parsed.length === 4) {
        return parsed;
    }

    return [0, 0, -0.65, 0];
};

export class ServoStore {
    servoA = 1.5;
    servoB = 1;
    servoC = 0;
    servoDelta = 1.3;
    servoInitial = "0; 0; -0.65; 0";

    servoXValues: number[] = [];
    servoYValues: number[] = [];
    servoZValues: number[] = [];

    constructor() {
        this.servoA = getStorageNumber("A", 1.5);
        this.servoB = getStorageNumber("B", 1);
        this.servoC = getStorageNumber("C", 0);
        this.servoDelta = getStorageNumber("delta", 1.3);
        this.servoInitial = getStorageString("initial", "0; 0; -0.65; 0");

        makeAutoObservable(this, {}, { autoBind: true });
    }

    get servoInitialArray() {
        return parseInitial(this.servoInitial);
    }

    get requestParams() {
        return {
            A: this.servoA,
            B: this.servoB,
            C: this.servoC,
            delta: this.servoDelta,
            initial: this.servoInitialArray,
        };
    }

    get zRange() {
        if (this.servoZValues.length === 0) {
            return null;
        }

        return {
            min: Math.min(...this.servoZValues),
            max: Math.max(...this.servoZValues),
        };
    }

    get yRange() {
        if (this.servoYValues.length === 0) {
            return null;
        }

        return {
            min: Math.min(...this.servoYValues),
            max: Math.max(...this.servoYValues),
        };
    }

    setServoA(value: number) {
        this.servoA = value;
        localStorage.setItem("A", String(value));
    }

    setServoB(value: number) {
        this.servoB = value;
        localStorage.setItem("B", String(value));
    }

    setServoC(value: number) {
        this.servoC = value;
        localStorage.setItem("C", String(value));
    }

    setServoDelta(value: number) {
        this.servoDelta = value;
        localStorage.setItem("delta", String(value));
    }

    setServoInitial(value: string) {
        this.servoInitial = value;
        localStorage.setItem("initial", value);
    }

    setServoSeries(xValues: number[], yValues: number[], zValues: number[]) {
        this.servoXValues = xValues;
        this.servoYValues = yValues;
        this.servoZValues = zValues;
    }
}
