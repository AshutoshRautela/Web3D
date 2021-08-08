import { mat4, vec3, vec4 } from "gl-matrix";
import { Scene } from "./Scene";
import { SceneObject } from "./SceneObject";
import { Util } from './Util';
export class Camera extends SceneObject {

    private viewMatrix: mat4;
    private projectionMatrix: mat4;

    private cameraForward: vec3;
    private cameraRight: vec3;
    private cameraUp: vec3;

    private lootAtPosition: vec3;


    constructor(scene3D: Scene) {
        super(scene3D);
        this.viewMatrix = mat4.create();
        this.projectionMatrix = mat4.create();

        this.cameraForward = vec3.create();
        this.cameraRight = vec3.create();
        this.cameraUp = vec3.create();
        this.lootAtPosition = vec3.create();

        this.transform.setPosition(vec3.fromValues(0 , 0 , -3));
        this.projectionMatrix = mat4.perspective(this.projectionMatrix, Util.DegreesToRadians(60),  this.scene3D.size.WIDTH / this.scene3D.size.HEIGHT , 0.00000000001, 1000);
    }

    onRender() {
        this.transform.onRender();

        this.cameraForward = vec3.add(this.cameraForward, this.transform.position, vec3.fromValues(0 , 0 , 1));

        this.viewMatrix = this.getViewMatrix();

        // Generating a view matrix for camera looking at the origin
        // this.viewMatrix = mat4.lookAt(this.viewMatrix, this.transform.position, this.cameraForward, vec3.fromValues(0 , 1 , 0));
    }

    // Generating LookAt Matrix
    getViewMatrix(): mat4 {
        this.cameraForward = vec3.fromValues(0 , 0 , -1);
        // this.cameraRight = vec3.cross(this.cameraRight ,  vec3.fromValues(0 , 1 , 0), this.cameraForward);
        // this.cameraUp = vec3.cross(this.cameraUp, this.cameraForward, this.cameraRight);
        this.cameraRight = vec3.cross(this.cameraRight , this.cameraForward, vec3.fromValues(0 , 1 , 0));
        this.cameraUp = vec3.cross(this.cameraUp, this.cameraRight, this.cameraForward);

        const dMatrix = mat4.fromValues(
            this.cameraRight[0], this.cameraRight[1], this.cameraRight[2] , 0,
            this.cameraUp[0], this.cameraUp[1], this.cameraUp[2], 0,
            this.cameraForward[0], this.cameraForward[1], this.cameraForward[2], 0,
            0 , 0 , 0 , 1
        );
        let tMatrix = mat4.create();
        tMatrix = mat4.translate(tMatrix, tMatrix, vec3.fromValues(-this.transform.position[0], -this.transform.position[1], -this.transform.position[2]));

        let vMatrix = mat4.create();
        vMatrix = mat4.multiply(vMatrix, dMatrix, tMatrix);
        return vMatrix;
    }

    public get ViewMatrix(): mat4 {
        return this.viewMatrix;
    }

    public get ProjectionMatrix(): mat4 {
        return this.projectionMatrix;
    }
}