import { mat4, vec3, vec4 } from 'gl-matrix';
import { EngineLifecycle } from './EngineLifeCycle';
import { Util } from './Util';

export class Transform implements EngineLifecycle {

    public position: vec3;
    public scale: vec3;
    public eulerAngles: vec3;

    private modelMatrix: mat4;

    private positionMatrix: mat4;
    private rotationMatrix: mat4;
    private scaleMatrix: mat4;

    constructor() {
        this.position = vec3.fromValues(0 , 0 , 0);
        this.eulerAngles = vec3.fromValues(0 , 0 , 0);
        this.scale = vec3.fromValues(1 , 1 , 1);

        this.modelMatrix = mat4.create();
        this.positionMatrix = mat4.create();
        this.rotationMatrix = mat4.create();
        this.scaleMatrix = mat4.create()
    }

    /**
     * setPosition
     */
    public setPosition(position: vec3): Transform {
        vec3.copy(this.position, position);
        return this;
    }

    /**
     * setScale
     */
    public setScale(scale: vec3): Transform {
        vec3.copy(this.scale, scale);
        return this;
    }

    /**
     * setEulerAngles
     */
    public setEulerAngles(angles: vec3): Transform {
        vec3.set(angles, Util.DegreesToRadians(angles[0]) , Util.DegreesToRadians(angles[1]), Util.DegreesToRadians(angles[2]));
        vec3.copy(this.eulerAngles, angles);
        return this;
    }

    public resetTransform(): Transform {
        this.setPosition(vec3.fromValues(0 , 0 , 0)).setEulerAngles(vec3.fromValues(0 , 0 , 0)).setScale(vec3.fromValues(1 , 1, 1));
        return this;
    }

    public translate(direction: vec3): void {
        this.position = vec3.add(this.position, this.position, direction);
    }

    public rotate(angle: vec3): void {
        this.eulerAngles = vec3.add(this.eulerAngles, this.eulerAngles, angle);
    }

    public updateMatrix(): void {
        this.positionMatrix = mat4.identity(this.positionMatrix);
        this.rotationMatrix = mat4.identity(this.rotationMatrix);
        this.scaleMatrix = mat4.identity(this.scaleMatrix);
        this.modelMatrix = mat4.identity(this.modelMatrix);

        this.positionMatrix = mat4.translate(this.positionMatrix, this.positionMatrix, this.position);

        let rotX = mat4.create();
        rotX = mat4.rotateX(rotX, rotX, this.eulerAngles[0]);
        let rotY = mat4.create();
        rotY = mat4.rotateY(rotY, rotY, this.eulerAngles[1]);
        let rotZ = mat4.create();
        rotZ = mat4.rotateZ(rotZ, rotZ, this.eulerAngles[2]);
        let rotZY = mat4.create();
        rotZY = mat4.multiply(rotZY, rotZ, rotY);

        this.rotationMatrix = mat4.multiply(this.rotationMatrix, rotZY, rotX);
        this.scaleMatrix = mat4.scale(this.scaleMatrix, this.scaleMatrix, this.scale);

        this.modelMatrix = mat4.multiply(this.modelMatrix, this.modelMatrix, this.positionMatrix);
        this.modelMatrix = mat4.multiply(this.modelMatrix, this.modelMatrix, this.rotationMatrix);
        this.modelMatrix = mat4.multiply(this.modelMatrix, this.modelMatrix, this.scaleMatrix);
    }

    public get ModelMatrix(): mat4 {
        return this.modelMatrix;
    }

    onRender() {
        this.updateMatrix();
    }
}