import { vec3 } from "gl-matrix";
import { Transform } from "../Transform";
import { Light } from "./Light";

export class SpotLight extends Light {

    private transform: Transform;
    private range: number = 10;

    constructor() {
        super();
        this.transform = new Transform();
        this.range = 10;
    }

    public get Transform() {
        return this.transform;
    }

    public setColor(lightColor: vec3) {
        vec3.set(this.color, lightColor[0], lightColor[1], lightColor[2]);
        return this;
    }

    public setIntensity(intensity: number) {
        this.intensity = intensity;
        return this;
    }

    public setPosition(position: vec3) {
        vec3.set(this.transform.position, position[0], position[1], position[2]);
        return this;
    }

    public setRange(range: number) {
        this.range = range;
        return this;
    }

    public get Position() {
        return this.transform.position;
    }
}