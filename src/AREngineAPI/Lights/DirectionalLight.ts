import { vec2, vec3, vec4 } from "gl-matrix";
import { Light } from "./Light";

export class DirectionalLight extends Light {

    private direction: vec3;

    constructor() {
        super();

        this.direction = vec3.fromValues(-1 , 1, 1);
    }

    public setDirection(direction: vec3) {
        vec3.set(this.direction, direction[0], direction[1], direction[2]);
        return this;
    }

    public setColor(lightColor: vec3) {
        vec3.set(this.color, lightColor[0], lightColor[1], lightColor[2]);
        return this;
    }

    public setIntensity(intensity: number) {
        this.intensity = intensity;
        return this;
    }
}