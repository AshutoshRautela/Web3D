import { vec2, vec3, vec4 } from 'gl-matrix';
import {
        Camera,
        DirectionalLight,
        Light, 
        PointLight, 
        Scene,
        SceneManager,
        Input,
        KeyCode, 
        Primitive,
        Model,
        PrimitiveType,
        MouseButton,
        Mesh,
        Texture2D,
        Web3D
     } from 'web3d-core';
import { MeshRenderer } from '../../web3d-core/src/MeshRenderer';

// Loading Models
import CubeMesh from './Mesh/Cube_v2.obj';
import GroundMesh from './Mesh/Plane.obj';
import CottageMesh from './Mesh/Cottage.obj';

let canvasRef: HTMLCanvasElement | null;
let scene3D: Scene;
let camera: Camera;
let cameraSpeed: number = 0.01;
let directionalLight: Light;

let pointLight1: Light;
let pointLight2: Light;

// Elements in Scene
let cube: Model;
let ground: Model;
let cottage: Model;

let uvSphere: Primitive;
let cone: Primitive;
let cylinder: Primitive;

let monkey: Primitive;


const arEngineSize = {
    width: 843,
    height: 600
}

const updateEngine = () => {
    scene3D.draw();
    const time = (performance.now() / 10000) * 10;

    (pointLight1 as PointLight).setPosition(vec3.fromValues(1, 3, Math.cos(time) * 10 + 8));
    (pointLight2 as PointLight).setPosition(vec3.fromValues(Math.cos(time) * 10, 3, 8));
    
    monkey.Transform.setPosition(vec3.fromValues(0, 3, Math.sin(time) * 5 + 4));
    cottage.Transform.setEulerAngles(vec3.fromValues(0, Math.sin(time / 10) * 360, 0));

    if (Input.IsKeyPressed(KeyCode.A)) {
        camera.Transform.Translate(vec3.fromValues(-cameraSpeed * 10, 0 , 0));
    }
    if (Input.IsKeyPressed(KeyCode.D)) {
        camera.Transform.Translate(vec3.fromValues(cameraSpeed * 10, 0 , 0));
    }
    if (Input.IsKeyPressed(KeyCode.W)) {
        camera.Transform.Translate(vec3.fromValues(0 , 0 , cameraSpeed * 10));
    }
    if (Input.IsKeyPressed(KeyCode.S)) {
        camera.Transform.Translate(vec3.fromValues(0 , 0 , -cameraSpeed * 10));
        console.log("S Pressed");
    }
    if (Input.IsKeyPressed(KeyCode.E)) {
        camera.Transform.Translate(vec3.fromValues(0 , cameraSpeed * 10, 0));
    }
    if (Input.IsKeyPressed(KeyCode.Q)) {
        camera.Transform.Translate(vec3.fromValues(0 , -cameraSpeed * 10, 0));
    }

    if (Input.IsMouseDown(MouseButton.Middle)?.isDown) {
        const { delta } = Input.IsMouseDown(MouseButton.Middle);
        camera.Transform.Translate(vec3.fromValues(-delta[0] * cameraSpeed, delta[1] * cameraSpeed, 0));
    }

    if (Input.OnMouseWheel()?.isWheeling) {
        camera.Transform.Translate(vec3.fromValues(0 , 0, Input.OnMouseWheel().wheelValue * 0.01));
    }

    window.requestAnimationFrame(updateEngine);
}

const addLights = () => {
    directionalLight = new DirectionalLight();
    (directionalLight as DirectionalLight).setDirection(vec3.fromValues(-1, -1, 0));
    scene3D.AddLight(directionalLight);

    pointLight1 = new PointLight();
    (pointLight1 as PointLight).setPosition(vec3.fromValues(0, 4, 4));
    // (pointLight1 as PointLight).setColor(vec3.fromValues(0 , 1 , 1));
    scene3D.AddLight(pointLight1);

    pointLight2 = new PointLight();
    (pointLight2 as PointLight).setPosition(vec3.fromValues(4 , 10 , 18));
    // (pointLight2 as PointLight).setColor(vec3.fromValues(1 , 0 , 1));
    scene3D.AddLight(pointLight2);
}

const addModels = () => {
    cube = new Model(scene3D, new MeshRenderer(scene3D.WebGLContext, new Mesh(CubeMesh.meshdata)));
    cube.Transform.setPosition(vec3.fromValues(4.5, 1, 4))
    cube.Material.setTexture('./textures/BrickWall2.jpeg');
    cube.Material.setTiling(vec2.fromValues(4 , 4));
    cube.Transform.setEulerAngles(vec3.fromValues(0, 45, 0));

    ground = new Model(scene3D, new MeshRenderer(scene3D.WebGLContext, new Mesh(GroundMesh.meshdata)));
    ground.Material.setTexture('./textures/BrickWall2.jpeg')
    ground.Material.setTiling(vec2.fromValues(10, 10))
        // .setDiffuseStrength(2)
        // .setSpecularStrength(0.4)
        // .setShininessStrength(70);
    ground.Transform.setScale(vec3.fromValues(50 , 50 , 50));
    scene3D.Add(ground);

    cottage = new Model(scene3D, new MeshRenderer(scene3D.WebGLContext, new Mesh(CottageMesh.meshdata)));
    cottage.Material.setTexture('./textures/BrickWall2.jpeg');
    scene3D.Add(cottage);
    
    uvSphere = Primitive.createPrimitive(scene3D, PrimitiveType.Sphere);
    uvSphere.Transform.setPosition(vec3.fromValues(-5, 1 , 4));
    scene3D.Add(cube);
    scene3D.Add(uvSphere);

    cone = Primitive.createPrimitive(scene3D, PrimitiveType.Cone);
    cone.Transform.setPosition(vec3.fromValues(3, 1, 8));
    scene3D.Add(cone);

    cylinder = Primitive.createPrimitive(scene3D, PrimitiveType.Cylinder);
    cylinder.Transform.setPosition(vec3.fromValues(-3 , 1 , 8));
    scene3D.Add(cylinder);

    monkey = Primitive.createPrimitive(scene3D, PrimitiveType.Monkey);
    monkey.Transform.setPosition(vec3.fromValues(0 , 3 , 5));
    monkey.Transform.setEulerAngles(vec3.fromValues(0 , 180, 0));
    scene3D.Add(monkey);

    camera.Transform.setPosition(vec3.fromValues(0, 3, -40));
    addLights();
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

    scene3D = SceneManager.createScene("TestScene", { width: canvasRef.width, height: canvasRef.height });
    camera = new Camera(scene3D);
    scene3D.AddCamera(camera);

    window.requestAnimationFrame(updateEngine);
    addModels();
}

