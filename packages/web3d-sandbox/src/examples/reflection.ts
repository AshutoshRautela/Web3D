import { vec3, vec4 } from 'gl-matrix';
import { Cubemap, SceneManager, DirectionalLight, Camera, Time, Scene, Web3D, PrimitiveType, Primitive, Input, KeyCode, CubemapTexture, Shaders } from 'web3d-core';

try {
    if (Web3D.init()) {
        const scene: Scene = SceneManager.createScene("TestScene1", { width: window.innerWidth, height: window.innerHeight });
        document.body.appendChild(scene.CanvasElement);

        const camera = new Camera(scene, vec3.fromValues(0, 1.5, -30));

        const sphere = Primitive.createPrimitive(scene, PrimitiveType.Sphere, Shaders.Reflective);
        const smoothMonkey = Primitive.createPrimitive(scene, PrimitiveType.Monkey, Shaders.Reflective);
        const cylinder = Primitive.createPrimitive(scene, PrimitiveType.Cylinder, Shaders.Reflective);

        const cube = Primitive.createPrimitive(scene, PrimitiveType.Cube, Shaders.Reflective);

        const cubemap = Cubemap.createCubemap(scene, new CubemapTexture(
            scene.WebGLContext,
            'Skybox/skybox1/right.jpg',
            'Skybox/skybox1/left.jpg',
            'Skybox/skybox1/top.jpg',
            'Skybox/skybox1/bottom.jpg',
            'Skybox/skybox1/front.jpg',
            'Skybox/skybox1/back.jpg'
        ));

        const dirLight = new DirectionalLight();
        dirLight.setDirection(vec3.fromValues(1, -1, 0));
        
        scene.AddCamera(camera);
        scene.Add(sphere);
        scene.Add(cube);
        scene.Add(smoothMonkey);
        scene.Add(cylinder);
        scene.Add(cubemap);

        scene.ClearColor = vec4.fromValues(0.1 , 0.1 , 0.1, 1.0);

        let cameraSpeed = 0.2;
        cubemap.Transform.setScale(vec3.fromValues(10 ,10 , 10));

        sphere.Transform.setPosition(vec3.fromValues(5 , 0 , 0));
        cube.Transform.setPosition(vec3.fromValues(-5 , 0 , 0));

        cylinder.Transform.setPosition(vec3.fromValues(5 , 3, 0));

        const renderLoop = () => {
            try {
                Time.update();
                scene.draw();
                
                if (Input.IsKeyPressed(KeyCode.W)) {
                    camera.Transform.Translate(vec3.fromValues(camera.LocalForward[0] * cameraSpeed, camera.LocalForward[1] * cameraSpeed, camera.LocalForward[2] * cameraSpeed));
                }
                if (Input.IsKeyPressed(KeyCode.S)) {
                    camera.Transform.Translate(vec3.fromValues(-camera.LocalForward[0] * cameraSpeed, -camera.LocalForward[1] * cameraSpeed, -camera.LocalForward[2] * cameraSpeed));
                }
                if (Input.IsKeyPressed(KeyCode.A)) {
                    camera.Transform.Translate(vec3.fromValues(-1 * cameraSpeed , 0 , 0));
                }
                if (Input.IsKeyPressed(KeyCode.D)) {
                    camera.Transform.Translate(vec3.fromValues(1 * cameraSpeed , 0 , 0));
                }
                if (Input.IsKeyPressed(KeyCode.E)) {
                    camera.Transform.Rotate(vec3.fromValues(0, cameraSpeed * 4 , 0));
                }
                if (Input.IsKeyPressed(KeyCode.Q)) {
                    camera.Transform.Rotate(vec3.fromValues(0, -cameraSpeed * 4 , 0));
                }

                if (Input.IsKeyPressed(KeyCode.X)) {
                    camera.Transform.Rotate(vec3.fromValues(-cameraSpeed * 4 , 0, 0));
                }
                if (Input.IsKeyPressed(KeyCode.Z)) {
                    camera.Transform.Rotate(vec3.fromValues(cameraSpeed * 4 , 0, 0));
                }

                window.requestAnimationFrame(renderLoop);
            }
            catch (e) {
                console.error("Error rendering frame! ", e);
            }

        };
        window.requestAnimationFrame(renderLoop);
    }
}
catch (e) {
    console.log("Error! ", e);
}





