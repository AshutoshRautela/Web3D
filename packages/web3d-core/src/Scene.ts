import { Camera } from './Camera';
import { DirectionalLight, Light, PointLight } from './Lights'
import { SceneObject } from './SceneObject';
export class Scene {

    public size = {
        WIDTH: 1200,
        HEIGHT: 600
    };

    private canvas: HTMLCanvasElement;
    private gl2: WebGL2RenderingContext;

    private renderCamera!: Camera;
    private renderableObjects: SceneObject[] = [];

    private directionalLights: DirectionalLight[] = [];
    private pointLights: PointLight[] = [];

    constructor(canvasElement: HTMLCanvasElement, size: {width: number, height: number}) {
        this.canvas = canvasElement;
        this.size.WIDTH = size.width;
        this.size.HEIGHT = size.height;

        this.gl2 = this.canvas.getContext('webgl2') as WebGL2RenderingContext;
        if (!this.gl2) {
            console.error('Failed to get Webgl2 Rendering Context');
        }
        console.log('Initializing WebGL Renderer');

        this.renderableObjects = new Array<SceneObject>();

        this.gl2.viewport(0 , 0, this.size.WIDTH, this.size.HEIGHT);
        this.gl2.enable(this.gl2.DEPTH_TEST);
        this.gl2.depthFunc(this.gl2.LESS);
    }

    private clearCanvas() {
        this.gl2.clearColor(0.05, 0.05, 0.05, 1.0);
        this.gl2.clear(this.gl2.COLOR_BUFFER_BIT | this.gl2.DEPTH_BUFFER_BIT);
        this.gl2.clearDepth(1);
        this.gl2.viewport(0, 0, this.size.WIDTH, this.size.HEIGHT);
    }

    public AddCamera(camera: Camera) {
        this.renderCamera = camera;
    }

    public AddLight(light: Light) {
        if (light instanceof DirectionalLight) {
            this.directionalLights.push(light);
        }
        if (light instanceof PointLight) {
            this.pointLights.push(light);
        }
    }

    public Add(sObject: SceneObject) {
        this.renderableObjects.push(sObject);
    }

    private lastTick = 0;

    public draw = () =>  {

        this.clearCanvas();

        this.gl2.enable(this.gl2.CULL_FACE);
        this.gl2.frontFace(this.gl2.CW);
        

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
}