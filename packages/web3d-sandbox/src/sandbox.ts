import { vec3, vec4 } from 'gl-matrix';
import {
        Camera,
        DirectionalLight,
        Light, 
        PointLight, 
        Scene,
        Input,
        KeyCode, 
        Primitive,
        PrimitiveType
     } from 'web3d-core';

let canvasRef: HTMLCanvasElement | null;
let scene3D: Scene;
let camera: Camera;
let cameraSpeed: number = 0.2;
let directionalLight: Light;

let pointLight1: Light;
let pointLight2: Light;

// Elements in Scene
let cube: Primitive;

let base: Primitive;

let uvSphere: Primitive;
let cone: Primitive;
let cylinder: Primitive;

const arEngineSize = {
    width: 843,
    height: 600
}

const updateEngine = () => {
    scene3D.draw();
    const time = (performance.now() / 10000) * 10;

    cube.Transform.setPosition(vec3.fromValues(0, 5, Math.sin(time) * 8 + 10));
    cube.Transform.setEulerAngles(vec3.fromValues(0, Math.sin(time) * 200, 0));

    (pointLight1 as PointLight).setPosition(vec3.fromValues(1, 3, Math.cos(time) * 10 + 8));
    (pointLight2 as PointLight).setPosition(vec3.fromValues(Math.cos(time) * 10, 3, 8));

    uvSphere.Transform.setPosition(vec3.fromValues(Math.sin(time) * 2, Math.cos(time) * 2 + 4, 3.0));

    base.Transform.setEulerAngles(vec3.fromValues(90, 0, 0));

    cone.Transform.setScale(vec3.fromValues(Math.sin(time) * 2 + 3, Math.sin(time) * 2 + 3, Math.sin(time) * 2 + 3));
    cone.Transform.setPosition(vec3.fromValues(Math.sin(time) * 2 , 1 , 10));
    cylinder.Transform.setEulerAngles(vec3.fromValues(Math.sin(time) * 80, 0, 0));

    if (Input.IsKeyPressed(KeyCode.A)) {
        camera.Transform.Translate(vec3.fromValues(-cameraSpeed , 0 , 0));
    }
    if (Input.IsKeyPressed(KeyCode.D)) {
        camera.Transform.Translate(vec3.fromValues(cameraSpeed , 0 , 0));
    }
    if (Input.IsKeyPressed(KeyCode.W)) {
        camera.Transform.Translate(vec3.fromValues(0 , 0 , cameraSpeed));
    }
    if (Input.IsKeyPressed(KeyCode.S)) {
        camera.Transform.Translate(vec3.fromValues(0 , 0 , -cameraSpeed));
        console.log("S Pressed");
    }
    if (Input.IsKeyPressed(KeyCode.E)) {
        camera.Transform.Translate(vec3.fromValues(0 , cameraSpeed, 0));
    }
    if (Input.IsKeyPressed(KeyCode.Q)) {
        camera.Transform.Translate(vec3.fromValues(0 , -cameraSpeed, 0));
    }
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

    cube = Primitive.createPrimitive(scene3D, PrimitiveType.Cube);
    
    cube.Transform.setPosition(vec3.fromValues(0, 0, 10))
    .setEulerAngles(vec3.fromValues(0, 0, 0));
    
    base = Primitive.createPrimitive(scene3D, PrimitiveType.Quad);
    base.Transform.setEulerAngles(vec3.fromValues(30, 0, 0))
    .setPosition(vec3.fromValues(0, 0, 10))
    .setScale(vec3.fromValues(20, 15, 1));
    base.Material.setColor(vec4.fromValues( 1 , 1 , 1, 1.0 ));
    scene3D.Add(base);
    
    uvSphere = Primitive.createPrimitive(scene3D, PrimitiveType.Sphere);
    uvSphere.Transform.setPosition(vec3.fromValues(0, 5 , 10));
    
    scene3D.Add(cube);
    scene3D.Add(uvSphere);

    cone = Primitive.createPrimitive(scene3D, PrimitiveType.Cone);
    cone.Transform.setPosition(vec3.fromValues(0 , 5 , 10));
    scene3D.Add(cone);

    cylinder = Primitive.createPrimitive(scene3D, PrimitiveType.Cylinder);
    cylinder.Transform.setPosition(vec3.fromValues(0 , 5 , 5));
    scene3D.Add(cylinder);

    camera.Transform.setPosition(vec3.fromValues(0, 3, -4));
}

canvasRef = document.createElement('canvas');
canvasRef.width = arEngineSize.width;
canvasRef.height = arEngineSize.height;
document.body.appendChild(canvasRef);

if (canvasRef) {
    const aspectRatio = window.innerWidth / window.innerHeight;
    if (window.innerHeight < window.innerWidth) {
        canvasRef.height = window.innerHeight;
        canvasRef.width = aspectRatio * canvasRef.height;
    }  else if (window.innerHeight >= window.innerWidth) {
        canvasRef.width = window.innerWidth;
        canvasRef.height = canvasRef.width / aspectRatio;
    }

    arEngineSize.width = canvasRef.width;
    arEngineSize.height = canvasRef.height;

    Input.activateInputSystem();

    // const cylinderMesh = CylinderCreator.createGeometry();
    // console.log(JSON.stringify(cylinderMesh, null, 2));

    scene3D = new Scene(canvasRef, arEngineSize);
    camera = new Camera(scene3D);
    scene3D.AddCamera(camera);

    window.requestAnimationFrame(updateEngine);
    addModels();
}

