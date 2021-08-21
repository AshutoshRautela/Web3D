import { Camera } from '../../Camera';
import { DirectionalLight, Light, PointLight } from '../../Lights'
import { SceneObject } from '../../SceneObject';
import { Subject, Subscription } from 'rxjs';

export interface ViewportSize {
    width: number;
    height: number;
}

export interface SceneDetails {
    name?: string;
}

export enum SceneEventType {
    OnLightAdd = "OnLightAdd",
    OnRenderableObjectAdd = "OnRenderableObjectAdd",
    OnCameraAdd = "OnCameraAdd",
    OnViewportResize = "OnViewportResize"
}

export class Scene {

    public size: ViewportSize = { width: 600, height: 400 };

    private canvas: HTMLCanvasElement;
    private gl2: WebGL2RenderingContext;

    private renderCamera!: Camera;
    private renderableObjects: SceneObject[] = [];

    private directionalLights: DirectionalLight[] = [];
    private pointLights: PointLight[] = [];

    private sceneEventDispatcher: Map<SceneEventType, Subject<SceneDetails>> = new Map<SceneEventType, Subject<SceneDetails>>();

    constructor(private name:string, size: ViewportSize, canvas?: HTMLCanvasElement) {
        this.canvas = canvas || document.createElement('canvas') as HTMLCanvasElement;
        this.gl2 = this.canvas.getContext('webgl2') as WebGL2RenderingContext;
        if (!this.gl2) {
            throw "Error getting WebGL Context";
        }
        this.prepareEventDispatcher();
        this.resizeScene(size, true);
        this.enableDepthTest();
        window.addEventListener('resize', () => this.resizeScene({width: window.innerWidth, height: window.innerHeight}, true));
    }

    public addEventListener(event: SceneEventType, callback: () => void): Subscription {
        const subject = this.sceneEventDispatcher.get(event);
        if (subject) {
            const subscription = subject.subscribe(callback);
            return subscription;
        }
    }

    public removeEventListener(subscription: Subscription) {
        subscription.unsubscribe();
    }

    private prepareEventDispatcher() {
        for(const value in SceneEventType) {
            this.sceneEventDispatcher.set(value as SceneEventType, new Subject<SceneDetails>());
        }
    }

    public enableDepthTest(enable: boolean = true) {
        if (enable) {
            this.gl2.enable(this.gl2.DEPTH_TEST);
            this.gl2.depthFunc(this.gl2.LESS);
        }
        else {
            this.gl2.disable(this.gl2.DEPTH_TEST);
        }
    }

    public resizeScene(size: ViewportSize, updateCanvas: boolean = false) {
        this.size = size;
        this.gl2.viewport(0 , 0 , this.size.width, this.size.height);
        if (updateCanvas) {
            this.canvas.width = this.size.width;
            this.canvas.height = this.size.height;
        }
        this.sceneEventDispatcher.get(SceneEventType.OnViewportResize).next({name: this.name});
    }

    public onDestroy() {

    }

    private clearCanvas() {
        this.gl2.clearColor(0.05, 0.05, 0.05, 1.0);
        this.gl2.clear(this.gl2.COLOR_BUFFER_BIT | this.gl2.DEPTH_BUFFER_BIT);
    }

    public AddCamera(camera: Camera) {
        this.renderCamera = camera;
        this.sceneEventDispatcher.get(SceneEventType.OnCameraAdd).next({name: this.name});
    }

    public AddLight(light: Light) {
        if (light instanceof DirectionalLight) {
            this.directionalLights.push(light);
        }
        if (light instanceof PointLight) {
            this.pointLights.push(light);
        }
        this.sceneEventDispatcher.get(SceneEventType.OnLightAdd).next({name: this.name});
    }

    public Add(sObject: SceneObject) {
        this.renderableObjects.push(sObject);
        this.sceneEventDispatcher.get(SceneEventType.OnRenderableObjectAdd).next({name: this.name});
    }

    private lastTick = 0;

    public draw = () =>  {

        this.clearCanvas();

        this.gl2.enable(this.gl2.CULL_FACE);
        this.gl2.frontFace(this.gl2.CW);
        
        if (!this.renderCamera) {
            throw "No render camera available";
        }
        this.renderCamera.onRender();

        const deltaTime = performance.now() - this.lastTick;
        this.lastTick = performance.now();

        this.renderableObjects.forEach(rObject => rObject.onRender && rObject.onRender(deltaTime));
    }

    public get WebGLContext(): WebGL2RenderingContext {
        return this.gl2;
    }

    public get RenderCamera(): Camera {
        return this.renderCamera;
    }

    public get DirectionalLights(): DirectionalLight[] {
        return this.directionalLights;
    }

    public get PointLights(): PointLight[] {
        return this.pointLights;
    }

    public get Lights(): Light[] {
        return [...this.directionalLights, ...this.pointLights];
    }

    public get AspectRatio(): number { return this.size.width /  this.size.height };

    public get CanvasElement(): HTMLCanvasElement {
        return this.canvas;
    }
}