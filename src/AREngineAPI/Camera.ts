import { mat4, vec3, vec4 } from "gl-matrix";
import { Scene } from "./Scene";
import { SceneObject } from "./SceneObject";

export class Camera extends SceneObject {

    private viewMatrix: mat4;
    private projectionMatrix: mat4;

    private cameraTarget: vec3;
    private cameraDirection: vec3;

    private cameraRight: vec3;
    private cameraUp: vec3;

    constructor(scene3D: Scene) {
        super(scene3D);
        this.viewMatrix = mat4.create();
        this.projectionMatrix = mat4.create();

        this.cameraTarget = vec3.create();
        this.cameraDirection = vec3.create();

        this.cameraDirection = vec3.sub(this.cameraDirection, this.transform.position, this.cameraTarget);
        this.cameraDirection = vec3.normalize(this.cameraDirection, this.cameraDirection);

        this.cameraRight = vec3.create();
        this.cameraRight = vec3.cross(this.cameraRight, vec3.fromValues(0 , 1 , 0), this.cameraDirection);
        this.cameraRight = vec3.normalize(this.cameraRight, this.cameraRight);

        this.cameraUp = vec3.create();
        this.cameraUp = vec3.cross(this.cameraUp, this.cameraDirection, this.cameraRight);
    }

    private test: number  = 0;

    onRender() {
        this.transform.onRender();

        this.viewMatrix = mat4.lookAt(this.viewMatrix, this.transform.position, this.cameraTarget, this.cameraUp);
        // this.projectionMatrix = mat4.perspective(this.projectionMatrix, 60,  1.67, 0.1, 1000);
        // this.projectionMatrix = mat4.ortho(this.projectionMatrix, -100, 100, -100, 100, -100, 1000);

        this.transform.setPosition(vec3.fromValues(0 , 0 , -10));
    }

    public get ViewMatrix(): mat4 {
        return this.viewMatrix;
    }

    public get ProjectionMatrix(): mat4 {
        return this.projectionMatrix;
    }
}