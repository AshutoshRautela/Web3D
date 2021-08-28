import { mat4 } from "gl-matrix";
import { Material, PhongShadingMaterial } from "../../Materials";
import { Scene, SceneEventType } from "../../SceneManagement";
import { SceneObject } from "../../SceneObject";
import { Transform } from "../../Transform";
import { MeshRenderer } from "../../MeshRenderer";
import { Mesh } from "../../Mesh";
import { Shaders, ShaderType } from "../../Shader";
import { Time } from "../../Time";

export class Model extends SceneObject {

    protected material: Material;
  
    constructor(scene3D: Scene,
        protected meshRenderer: MeshRenderer,
        shaderType?: Shaders
    ) {
        super(scene3D);
        this.material = new PhongShadingMaterial(this.scene3D, this, [], shaderType || Shaders.StandardPhong);
        this.transform = new Transform();
        this.meshRenderer.setShaderProgram(this.material.ShaderProgram);
        this.meshRenderer.onInit();
    }

    static createRenderableMode(scene3D: Scene, mesh: Mesh, shaderType?: Shaders): Model {
        const meshRenderer = new MeshRenderer(scene3D.WebGLContext, mesh);
        const model = new Model(scene3D, meshRenderer, shaderType);
        return model;
    }

    onRender(deltaTime: number) {
        if (this.material?.ShaderProgram) {
            this.transform.onRender();
           
            this.material.bind();
            this.meshRenderer.draw();
            this.material.unbind();
        }
    }

    onDestroy() {
        this.meshRenderer.onDestroy();
        this.material.onDestroy();
    }

    public get Material(): Material {
        return this.material;
    }
}