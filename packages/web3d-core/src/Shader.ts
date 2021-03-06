import { EngineLifecycle } from './EngineLifeCycle';

export enum ShaderType {
    VERTEX = "Vertex",
    FRAGMENT = "Fragment"
}

export enum Shaders {
    StandardPhong = "StandardPhong",
    Unlit = "Unlit",
    Skybox = "Skybox",
    Reflective = "Reflective",
    Refractive = "Refractive"
}

export class Shader implements EngineLifecycle {

    private vShader: WebGLShader | null;
    private fShader: WebGLShader | null;

    private shaderProgram: WebGLProgram | null;

    constructor(private gl2: WebGL2RenderingContext, private vertShaderSource: string, private fragShaderSource: string) {
        this.vShader = this.compileShader(ShaderType.VERTEX);
        this.fShader = this.compileShader(ShaderType.FRAGMENT);
        this.shaderProgram = this.createShaderProgram();
    }

    private compileShader(shaderType: ShaderType): WebGLShader | null {
        const shader = this.gl2.createShader(shaderType === ShaderType.VERTEX ? this.gl2.VERTEX_SHADER : this.gl2.FRAGMENT_SHADER) as WebGLShader;
        this.gl2.shaderSource(shader, shaderType === ShaderType.VERTEX ? this.vertShaderSource : this.fragShaderSource);
        this.gl2.compileShader(shader);

        if (!this.gl2.getShaderParameter(shader, this.gl2.COMPILE_STATUS)) {
            console.error('Failed to compile Shader: ', shaderType,  this.gl2.getShaderInfoLog(shader));
            this.cleanUp();
            return null;
        }
        return shader;
    }

    public createShaderProgram(): WebGLProgram | null {
        if (!this.vShader || !this.fShader) {
            return null;
        }

        const program = this.gl2.createProgram();

        if (!program) {
            console.log("Failed to create WebGL Program");
            return null;
        }

        this.gl2.attachShader(program, this.vShader);
        this.gl2.attachShader(program, this.fShader);
        this.gl2.linkProgram(program);

        if (!this.gl2.getProgramParameter(program, this.gl2.LINK_STATUS)) {
            console.error('Failed to link shader program: ', this.gl2.getProgramInfoLog(program));
            this.cleanUp();
            this.gl2.deleteProgram(program);
            return null;
        }

        this.gl2.validateProgram(program);
        if (!this.gl2.getProgramParameter(program, this.gl2.VALIDATE_STATUS)) {
            console.error('Failed to validate shader program ', this.gl2.getProgramInfoLog(program));
            this.cleanUp();
            this.gl2.deleteProgram(program);
            return null;
        }

        this.gl2.detachShader(program, this.vShader);
        this.gl2.detachShader(program, this.fShader);
        this.cleanUp();
        return program;
    }

    private cleanUp() {
        this.vShader && this.gl2.deleteShader(this.vShader);
        this.fShader && this.gl2.deleteShader(this.fShader);
        this.shaderProgram && this.gl2.deleteProgram(this.shaderProgram);
    }

    public get ShaderProgram(): WebGLProgram | null {
        return this.shaderProgram;
    }

    public static createShader(gl2: WebGL2RenderingContext, shaderType: Shaders): Shader {
        let shader: Shader;
        if (shaderType === Shaders.StandardPhong) {
            shader = new Shader(gl2, require('./Shaders/vertMvp/vert.glsl'), require('./Shaders/vertMvp/frag.glsl'));
        } else if (shaderType === Shaders.Unlit) {
            shader = new Shader(gl2, require('./Shaders/Unlit/vert.glsl'), require('./Shaders/Unlit/frag.glsl'));
        } else if (shaderType === Shaders.Skybox) {
            shader = new Shader(gl2, require('./Shaders/skybox/vert.glsl'), require('./Shaders/skybox/frag.glsl'));
        } else if (shaderType === Shaders.Reflective) {
            shader = new Shader(gl2, require('./Shaders/reflective/vertex.glsl'), require('./Shaders/reflective/fragment.glsl'));
        } else if (shaderType === Shaders.Refractive) {
            console.log("Creating Refractive Shader");
            shader = new Shader(gl2, require('./Shaders/refractive/vertex.glsl'), require('./Shaders/refractive/fragment.glsl'));
        }
        return shader;
    }

    onDestroy() {
        this.cleanUp();
    }
}