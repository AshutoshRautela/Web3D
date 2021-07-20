import { vec3 } from "gl-matrix";
import { Camera } from "./AREngineAPI/Camera";
import { Scene } from "./AREngineAPI/Scene";
import { Quad } from "./AREngineAPI/Shapes/Quad";

let canvasRef: HTMLCanvasElement | null;
let scene3D: Scene;
let quad: Quad;
let camera: Camera;

const arEngineSize = {
    width: 1280,
    height: 720
}

const updateEngine = () => {
    scene3D.draw();
    const time = (performance.now() / 10000) * 10;
    
    // quad.Transform.setPosition(vec3.fromValues(Math.sin(time)/2, Math.cos(time)/2 , 0));
    window.requestAnimationFrame(updateEngine);
}

canvasRef = document.createElement('canvas');
canvasRef.width = arEngineSize.width;
canvasRef.height = arEngineSize.height;

document.body.appendChild(canvasRef);

console.log("Main Running");

if (canvasRef) {
    scene3D = new Scene(canvasRef, arEngineSize);
    camera = new Camera(scene3D);
    scene3D.AddCamera(camera);
    
    quad = new Quad(scene3D, { x: -0.5, y: 0.5, z: 0.0 },
        { x: 0.5 , y: 0.5, z: 0.0 },
        { x: 0.5 , y: -0.5, z: 0.0 },
        { x: -0.5 , y: -0.5, z: 0.0 });
    
    
    quad.Transform.setScale(vec3.fromValues(0.5, 0.2, 1.0));
    window.requestAnimationFrame(updateEngine);
    scene3D.Add(quad);
}

