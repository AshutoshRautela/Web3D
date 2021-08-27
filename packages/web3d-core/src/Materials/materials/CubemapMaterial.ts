import { mat4 } from "gl-matrix";
import { Scene } from "../../SceneManagement";
import { Shader, Shaders } from "../../Shader";
import { Cubemap } from "../../Shapes/shapes/Cubemap";
import { CubemapTexture } from "../../Textures";
import { Material } from "./Material";

export class CubemapMaterial extends Material {

    private projectionUniformLocation: WebGLUniformLocation | null;
    private viewUniformLocation: WebGLUniformLocation | null;
    
    constructor(protected scene3D: Scene, private cubemap: Cubemap, private cubemapTexture: CubemapTexture) {
        super(scene3D, Shaders.Skybox);
        this.gl2 = this.scene3D.WebGLContext;
        this.initUniforms();
    }

    private initUniforms() {
        this.projectionUniformLocation = this.gl2.getUniformLocation(this.shader.ShaderProgram, 'u_projection');
        this.viewUniformLocation = this.gl2.getUniformLocation(this.shader.ShaderProgram, 'u_view');
    }

    public bind() {
        this.gl2.depthFunc(this.gl2.LEQUAL);
        this.gl2.useProgram(this.shader.ShaderProgram);

        this.gl2.uniformMatrix4fv(this.projectionUniformLocation, false, this.scene3D.RenderCamera.ProjectionMatrix);
        this.gl2.uniformMatrix4fv(this.viewUniformLocation, false, this.scene3D.RenderCamera.ViewMatrix);

        this.cubemapTexture.bind();
    }

    public unbind( ){
        this.cubemapTexture.unbind();
        this.gl2.depthFunc(this.gl2.LESS);
    }

    onDestroy() {
        this.shader.onDestroy();
    }
}