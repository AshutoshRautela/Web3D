import { mat4 } from "gl-matrix";
import { DirectionalLight, PointLight } from "../../Lights";
import { MaterialEventType, PhongShadingMaterial } from "../../Materials";
import { Scene, SceneEventType } from "../../SceneManagement";
import { SceneObject } from "../../SceneObject";
import { Transform } from "../../Transform";
import { MeshRenderer } from "../../MeshRenderer";
import { Mesh } from "../../Mesh";
import { Shaders } from "../../Shader";

export class Model extends SceneObject {

    protected material: PhongShadingMaterial;

    private timeUniformLocation!: WebGLUniformLocation | null;
    private mvpUniformLocation!: WebGLUniformLocation | null;
    private modelUniformLocation: WebGLUniformLocation | null;
  
    constructor(scene3D: Scene,
        protected meshRenderer: MeshRenderer,
        material?: PhongShadingMaterial
    ) {
        super(scene3D);
        this.material = material || new PhongShadingMaterial(this.scene3D);
        this.transform = new Transform();
        this.meshRenderer.setShaderProgram(this.material.ShaderProgram);
        this.meshRenderer.onInit();
        this.initUniforms();

        scene3D.addEventListener(SceneEventType.OnLightAdd, () => {
            this.initUniforms();
        });
    }

    private initUniforms() {
        if (this.material?.ShaderProgram) {
            this.timeUniformLocation = this.gl2.getUniformLocation(this.material.ShaderProgram, 'u_time');
            this.mvpUniformLocation = this.gl2.getUniformLocation(this.material.ShaderProgram, 'u_mvp');
            this.modelUniformLocation = this.gl2.getUniformLocation(this.material.ShaderProgram, 'u_model');
        }
    }

    static createRenderableMode(scene3D: Scene, mesh: Mesh, shaderType?: Shaders): Model {
        const meshRenderer = new MeshRenderer(scene3D.WebGLContext, mesh);
        const model = new Model(scene3D, meshRenderer, new PhongShadingMaterial(scene3D, [], shaderType));
        return model;
    }

    onRender(deltaTime: number) {
        if (this.material?.ShaderProgram) {
            this.transform.onRender();

            let mvMatrix: mat4 = mat4.create();
            mvMatrix = mat4.multiply(mvMatrix, this.scene3D.RenderCamera.ProjectionMatrix, this.scene3D.RenderCamera.ViewMatrix);
            mvMatrix = mat4.multiply(mvMatrix, mvMatrix, this.transform.ModelMatrix);

            this.gl2.useProgram(this.material.ShaderProgram);

            this.gl2.uniform1f(this.timeUniformLocation, performance.now() / 500);
            this.gl2.uniformMatrix4fv(this.mvpUniformLocation, false, mvMatrix);
            this.gl2.uniformMatrix4fv(this.modelUniformLocation, false, this.transform.ModelMatrix);
           
            this.material.bind();
            this.meshRenderer.draw();
            this.material.unbind();
        }
    }

    onDestroy() {
        this.meshRenderer.onDestroy();
        this.material.onDestroy();
    }

    public get Material(): PhongShadingMaterial {
        return this.material;
    }
}