import { vec3 } from "gl-matrix";

export class Light { 
    
    protected color: vec3;
    protected intensity: number;

    constructor() {
        this.color = vec3.fromValues(1 , 1 , 1);
        this.intensity = 1;
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