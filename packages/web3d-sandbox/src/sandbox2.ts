import { vec3 } from 'gl-matrix';
import { SceneManager, Model, Mesh, DirectionalLight, Camera, Time, Scene, Web3D, PrimitiveType, Primitive } from 'web3d-core';

// 3D Models
import CottageMesh from './Mesh/Cottage.obj';

try {
    if (Web3D.init()) {
        const scene: Scene = SceneManager.createScene("TestScene1", { width: window.innerWidth, height: window.innerHeight });
        document.body.appendChild(scene.CanvasElement);

        const camera = new Camera(scene, vec3.fromValues(0, 10, -40));

        const cottage = Model.createRenderableMode(scene, new Mesh(CottageMesh.meshdata))
        cottage.Material.setTexture('Mesh/cottage_diffuse.png');

        const ground = Primitive.createPrimitive(scene, PrimitiveType.Quad);
        ground.Transform.setScale(vec3.fromValues(40, 40, 40));
        ground.Transform.setEulerAngles(vec3.fromValues(90, 0, 0));

        const dirLight = new DirectionalLight();
        dirLight.setDirection(vec3.fromValues(-1, 1, 0));

        scene.Add(cottage);
        scene.AddCamera(camera);
        scene.Add(ground);
        scene.AddLight(dirLight);

        const renderLoop = () => {
            try {
                Time.update();
                scene.draw();
                cottage.Transform.setEulerAngles(vec3.fromValues(0, Math.sin(Time.time) * 180, 0));

                window.requestAnimationFrame(renderLoop);
            }
            catch (e) {
                console.error("Error rendering frame! ", e);
            }

        };
        window.requestAnimationFrame(renderLoop);
        Web3D.clean();
    }
}
catch (e) {
    console.log("Error! ", e);
}





