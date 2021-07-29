import { vec3 } from 'gl-matrix';
import { Camera } from './AREngineAPI/Camera';
import { Scene } from './AREngineAPI/Scene';
import { Cube } from './AREngineAPI/Shapes/Cube';
import { Quad } from './AREngineAPI/Shapes/Quad';

let canvasRef: HTMLCanvasElement | null;
let scene3D: Scene;
let camera: Camera;

// Elements in Scene
let quad: Quad;
let cube: Cube;


const arEngineSize = {
    width: 843,
    height: 600
}

const updateEngine = () => {
    scene3D.draw();
    const time = (performance.now() / 10000) * 10;

    cube.Transform.Translate(vec3.fromValues(0 , 0 , Math.sin(time)));
    quad.Transform.setPosition(vec3.fromValues(Math.sin(time) * 2, Math.cos(time) * 1.5, 0));
    
    cube.Transform.Rotate(vec3.fromValues(0 , 0.04, 0));
    window.requestAnimationFrame(updateEngine);
}

const addModels = () => {
    quad = new Quad(scene3D);
    quad.Transform.setScale(vec3.fromValues(0.5, 0.5, 1.0))
        .setEulerAngles(vec3.fromValues(0, 0, 0))
        .setPosition((vec3.fromValues(0, 0, 0)));
    scene3D.Add(quad);

    cube = new Cube(scene3D);
    scene3D.Add(cube);

    cube.Transform.setPosition(vec3.fromValues(0, 0, 10))
                   .setEulerAngles(vec3.fromValues(0, 0, 0));
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

