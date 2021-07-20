
import { EngineLifecycle } from "./EngineLifeCycle";
import { Scene } from "./Scene";
import { Transform } from "./Transform";

export abstract class SceneObject implements EngineLifecycle {

    public onInit?(): void;
    public onDestroy?(): void;
    public onRender?(deltaTime?: number): void;

    public onKeyDown?(keyEvent: KeyboardEvent): void;
    public onKeyPress?(keyEvent: KeyboardEvent): void;
    public onKeyUp?(keyEvent: KeyboardEvent): void;

    protected transform: Transform;
    protected gl2: WebGL2RenderingContext;

    constructor(protected scene3D: Scene) {
        this.transform = new Transform();
        this.gl2 = scene3D.WebGLContext;
    }

    public get Transform() {
        return this.transform;
    }
}

export interface Vector3 {
    x: number;
    y: number;
    z?: number;
}