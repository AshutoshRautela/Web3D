import { vec3 } from "gl-matrix";

export class Light { 
    
    protected color: vec3;
    protected intensity: number;

    constructor() {
        this.color = vec3.fromValues(1 , 1 , 1);
        this.intensity = 1;
    }
}