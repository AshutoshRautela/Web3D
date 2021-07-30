import { Transform } from "../Transform";
import { Light } from "./Light";

export class SpotLight extends Light {

    private transform: Transform;

    constructor() {
        super();
        this.transform = new Transform();
    }

    public get Transform() {
        return this.transform;
    }
}