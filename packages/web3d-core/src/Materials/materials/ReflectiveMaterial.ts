import { mat4 } from "gl-matrix";
import { Scene } from "../../SceneManagement";
import { Shaders } from "../../Shader";
import { Model } from "../../Shapes";
import { CubemapMaterial } from "./CubemapMaterial";
import { Material } from "./Material";

export class ReflectiveMaterial extends Material {

    private modelUniformLocation: WebGLUniformLocation | null;
    private mvpUniformLocation: WebGLUniformLocation | null;
    private cameraPosUniformLocation: WebGLUniformLocation | null;

    constructor(protected scene3D: Scene, private model: Model) {
        super(scene3D, Shaders.Reflective);
        this.gl2 = this.scene3D.WebGLContext;
        this.initUniforms();
    }

    private initUniforms() {
        this.modelUniformLocation = this.gl2.getUniformLocation(this.shader.ShaderProgram, 'u_model');
        this.mvpUniformLocation = this.gl2.getUniformLocation(this.shader.ShaderProgram, 'u_mvp');
        this.cameraPosUniformLocation = this.gl2.getUniformLocation(this.shader.ShaderProgram, 'u_cameraPos');
    }

    bind() {
        let mvpMatrix: mat4 = mat4.create();
        mvpMatrix = mat4.multiply(mvpMatrix, this.scene3D.RenderCamera.ProjectionMatrix, this.scene3D.RenderCamera.ViewMatrix);
        mvpMatrix = mat4.multiply(mvpMatrix, mvpMatrix, this.model.Transform.ModelMatrix);

        this.gl2.useProgram(this.shader.ShaderProgram);

        this.gl2.uniformMatrix4fv(this.modelUniformLocation, false, this.model.Transform.ModelMatrix);
        this.gl2.uniformMatrix4fv(this.mvpUniformLocation, false, mvpMatrix);
        this.gl2.uniform3fv(this.cameraPosUniformLocation, this.scene3D.RenderCamera.Transform.position);

        (this.scene3D.EnvironmentMap.Material as CubemapMaterial).EMapTexture.bind();
    }

    unbind() {
        //
        (this.scene3D.EnvironmentMap.Material as CubemapMaterial).EMapTexture.unbind();
    }

    onDestroy() {
        this.shader.onDestroy();
    }
}