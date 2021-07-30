import { Camera } from './Camera';
import { Light } from './Lights/Light';
import { SceneObject } from './SceneObject';
export class Scene {

    public size = {
        WIDTH: 1200,
        HEIGHT: 600
    };

    private canvas: HTMLCanvasElement;
    private gl2: WebGL2RenderingContext;

    private renderCamera!: Camera;
    private light!: Light;

    private renderableObjects: SceneObject[] = [];

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
        this.registerToInput();

        this.gl2.viewport(0 , 0, this.size.WIDTH, this.size.HEIGHT);
    }

    private registerToInput() {
        window.addEventListener('keydown', this.onKeyboardDown);
        window.addEventListener('keypress', this.onKeyboardPress);
        window.addEventListener('keyup', this.onKeyboardUp);
    }

    private unregisterToInput() {
        window.removeEventListener('keydown', this.onKeyboardDown);
        window.removeEventListener('keypress', this.onKeyboardPress);
        window.removeEventListener('keyup', this.onKeyboardUp);
    }

    private onKeyboardDown = (event: KeyboardEvent) => {
        this.renderableObjects.forEach(rObject => rObject.onKeyDown && rObject.onKeyDown(event));
        this.renderCamera.onKeyDown && this.renderCamera.onKeyDown(event);
    }

    private onKeyboardUp = (event: KeyboardEvent) => {
        this.renderableObjects.forEach(rObject => rObject.onKeyUp && rObject.onKeyUp(event));
        this.renderCamera.onKeyUp && this.renderCamera.onKeyUp(event);
    }

    private onKeyboardPress = (event: KeyboardEvent) => {
        this.renderableObjects.forEach(rObject => rObject.onKeyPress && rObject.onKeyPress(event));
        this.renderCamera.onKeyPress && this.renderCamera.onKeyPress(event);
    }

    private clearCanvas() {
        this.gl2.clearColor(0.5, 0.5, 0.5, 1.0);
        this.gl2.clear(this.gl2.COLOR_BUFFER_BIT | this.gl2.DEPTH_BUFFER_BIT);
        this.gl2.viewport(0, 0, this.size.WIDTH, this.size.HEIGHT);
    }

    public AddCamera(camera: Camera) {
        this.renderCamera = camera;
    }

    public AddLight(light: Light) {
        this.light = light;
    }

    public Add(sObject: SceneObject) {
        this.renderableObjects.push(sObject);
    }

    private lastTick = 0;

    public draw = () =>  {
        this.gl2.enable(this.gl2.CULL_FACE);
        this.gl2.frontFace(this.gl2.CW);

        this.clearCanvas();
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
}