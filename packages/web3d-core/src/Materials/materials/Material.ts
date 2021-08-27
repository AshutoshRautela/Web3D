import { EngineLifecycle } from "../../EngineLifeCycle";
import { Scene } from "../../SceneManagement";
import { Shader, Shaders } from "../../Shader";

export abstract class Material implements EngineLifecycle {

    protected shader: Shader;
    protected gl2: WebGL2RenderingContext;
    
    constructor(protected scene3D: Scene, protected shaderType: Shaders = Shaders.StandardPhong) {
        this.shader = Shader.createShader(this.scene3D.WebGLContext, this.shaderType);
    }   

    onDestroy() {
        this.gl2.deleteShader(this.shader);
    }

    abstract bind(): void;
    abstract unbind(): void;

    public get ShaderProgram() {
        return this.shader.ShaderProgram;
    }
}