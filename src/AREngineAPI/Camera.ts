import { mat4, vec3, vec4 } from "gl-matrix";
import { Scene } from "./Scene";
import { SceneObject } from "./SceneObject";
import { Util } from './Util';
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

        this.transform.setPosition(vec3.fromValues(0 , 0 , -3));
        this.projectionMatrix = mat4.perspective(this.projectionMatrix, Util.DegreesToRadians(60),  this.scene3D.size.WIDTH / this.scene3D.size.HEIGHT , 0.0001, 1000);
    }

    onRender() {
        this.transform.onRender();
        this.viewMatrix = this.transform.ModelMatrix;
    }

    onKeyPress(event: KeyboardEvent) {
        console.log("Key Press: ", event.key);
        const step = 0.01;
        if (event.key === 'w') {
            this.transform.translate(vec3.fromValues(0 , 0 , 1 * step));
        }
        else if (event.key === 'a') {
            this.transform.translate(vec3.fromValues(-1 * step, 0 , 0));
        }
        else if (event.key === 'd') {
            this.transform.translate(vec3.fromValues(0 , 0 , -1 * step));
        }
        else if (event.key === 's') {
            this.transform.translate(vec3.fromValues(0 , 0 , -1 * step));
        }

        console.log("Position: ", this.transform.position);
    }

    public get ViewMatrix(): mat4 {
        return this.viewMatrix;
    }

    public get ProjectionMatrix(): mat4 {
        return this.projectionMatrix;
    }
}