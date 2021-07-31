import { vec3, vec4 } from 'gl-matrix';
import { Camera } from './AREngineAPI/Camera';
import { DirectionalLight } from './AREngineAPI/Lights/DirectionalLight';
import { Light } from './AREngineAPI/Lights/Light';
import { PointLight } from './AREngineAPI/Lights/PointLight';
import { Scene } from './AREngineAPI/Scene';
import { Cube } from './AREngineAPI/Shapes/Cube';
import { Quad } from './AREngineAPI/Shapes/Quad';

let canvasRef: HTMLCanvasElement | null;
let scene3D: Scene;
let camera: Camera;
let directionalLight: Light;

let pointLight1: Light;
let pointLight2: Light;

// Elements in Scene
let quad: Quad;
let cube: Cube;

let base: Quad;

const arEngineSize = {
    width: 843,
    height: 600
}

const updateEngine = () => {
    scene3D.draw();
    const time = (performance.now() / 10000) * 10;

    cube.Transform.setPosition(vec3.fromValues(0, 5, Math.sin(time) * 8 + 10));
    cube.Transform.setEulerAngles(vec3.fromValues(0, Math.sin(time) * 200, 0));
    quad.Transform.setEulerAngles(vec3.fromValues(0, Math.sin(time) * 200, 0));
    // quad.Transform.setPosition(vec3.fromValues(Math.sin(time) * 2, Math.cos(time) * 1.5 + 3, 4));

    (pointLight1 as PointLight).setPosition(vec3.fromValues(1, 3, Math.cos(time) * 10 + 8));
    (pointLight2 as PointLight).setPosition(vec3.fromValues(Math.cos(time) * 10, 3, 8));

    // base.Transform.setEulerAngles(vec3.fromValues(Math.sin(time * 2) * 5 + 95, 0 , 0 ));
    base.Transform.setEulerAngles(vec3.fromValues(90, 0, 0));

    window.requestAnimationFrame(updateEngine);
}

const addLights = () => {
    directionalLight = new DirectionalLight();
    (directionalLight as DirectionalLight).setDirection(vec3.fromValues(1, 1, -1));

    pointLight1 = new PointLight();
    (pointLight1 as PointLight).setPosition(vec3.fromValues(0, 4, 4));
    (pointLight1 as PointLight).setColor(vec3.fromValues(0 , 1 , 1));
    scene3D.AddLight(pointLight1);

    pointLight2 = new PointLight();
    (pointLight2 as PointLight).setPosition(vec3.fromValues(4 , 10 , 18));
    (pointLight2 as PointLight).setColor(vec3.fromValues(1 , 0 , 1));
    scene3D.AddLight(pointLight2);
}

const addModels = () => {
    addLights();

    quad = new Quad(scene3D);
    quad.Transform.setScale(vec3.fromValues(2, 2, 2))
        .setEulerAngles(vec3.fromValues(0, 0, 0))
        .setPosition((vec3.fromValues(0, 5, 10)));
    // scene3D.Add(quad);

    cube = new Cube(scene3D);
    scene3D.Add(cube);

    cube.Transform.setPosition(vec3.fromValues(0, 0, 10))
        .setEulerAngles(vec3.fromValues(0, 0, 0));

    base = new Quad(scene3D);
    base.Transform.setEulerAngles(vec3.fromValues(30, 0, 0))
        .setPosition(vec3.fromValues(0, 0, 10))
        .setScale(vec3.fromValues(20, 15, 1));
    base.Material.setColor(vec4.fromValues( 1 , 1 , 1, 1.0 ));
        

    scene3D.Add(base);

    camera.Transform.setPosition(vec3.fromValues(0, 3, -4));
}

canvasRef = document.createElement('canvas');
canvasRef.width = arEngineSize.width;
canvasRef.height = arEngineSize.height;
const aspectRatio = 16/9;
document.body.appendChild(canvasRef);

console.log('Main Running');

if (canvasRef) {
    console.log("Screen Res: ", window.innerWidth, window.innerHeight);
    if (window.innerWidth > window.innerHeight) {
        canvasRef.width = window.innerWidth;
        canvasRef.height = canvasRef.width / aspectRatio;
    } else {
        canvasRef.height = window.innerHeight;
        canvasRef.width = aspectRatio * canvasRef.height;
    }
    arEngineSize.width = canvasRef.width;
    arEngineSize.height = canvasRef.height;

    scene3D = new Scene(canvasRef, arEngineSize);
    camera = new Camera(scene3D);
    scene3D.AddCamera(camera);

    window.requestAnimationFrame(updateEngine);
    addModels();
}

