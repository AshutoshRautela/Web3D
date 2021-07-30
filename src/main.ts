import { vec3 } from 'gl-matrix';
import { Camera } from './AREngineAPI/Camera';
import { DirectionalLight } from './AREngineAPI/Lights/DirectionalLight';
import { Light } from './AREngineAPI/Lights/Light';
import { Scene } from './AREngineAPI/Scene';
import { Cube } from './AREngineAPI/Shapes/Cube';
import { Quad } from './AREngineAPI/Shapes/Quad';

let canvasRef: HTMLCanvasElement | null;
let scene3D: Scene;
let camera: Camera;
let light: Light;

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

    // cube.Transform.setPosition(vec3.fromValues(0, 3, 20 + Math.sin(time) * 10));
    quad.Transform.setEulerAngles(vec3.fromValues(0, Math.sin(time) * 200, 0));
    // quad.Transform.setPosition(vec3.fromValues(Math.sin(time) * 2, Math.cos(time) * 1.5 + 3, 4));

    base.Transform.setEulerAngles(vec3.fromValues(Math.sin(time * 2) * 5 + 95, 0 , 0 ));

    cube.Transform.Rotate(vec3.fromValues(0, 0.04, 0));
    window.requestAnimationFrame(updateEngine);
}

const addModels = () => {
    quad = new Quad(scene3D);
    quad.Transform.setScale(vec3.fromValues(2, 2, 2))
        .setEulerAngles(vec3.fromValues(0, 0, 0))
        .setPosition((vec3.fromValues(0, 5, 10)));
    scene3D.Add(quad);

    cube = new Cube(scene3D);
    // scene3D.Add(cube);

    cube.Transform.setPosition(vec3.fromValues(0, 0, 10))
        .setEulerAngles(vec3.fromValues(0, 0, 0));

    base = new Quad(scene3D);
    base.Transform.setEulerAngles(vec3.fromValues(30 , 0 , 0))
                  .setPosition(vec3.fromValues(0 , 0 , 10))
                  .setScale(vec3.fromValues(20 , 15, 1));
    
    scene3D.Add(base);

    light = new DirectionalLight();
    (light as DirectionalLight).setDirection(vec3.fromValues(-1, -1, 1));

    camera.Transform.setPosition(vec3.fromValues(0, 3, -4));
}

canvasRef = document.createElement('canvas');
canvasRef.width = arEngineSize.width;
canvasRef.height = arEngineSize.height;

document.body.appendChild(canvasRef);

console.log('Main Running');

if (canvasRef) {
    scene3D = new Scene(canvasRef, arEngineSize);
    camera = new Camera(scene3D);
    scene3D.AddCamera(camera);

    window.requestAnimationFrame(updateEngine);
    addModels();
}

