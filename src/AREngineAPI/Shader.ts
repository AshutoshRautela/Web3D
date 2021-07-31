import { EngineLifecycle } from './EngineLifeCycle';

export enum ShaderType {
    VERTEX,
    FRAGMENT
}

export class Shader implements EngineLifecycle {

    private vShader: WebGLShader | null;
    private fShader: WebGLShader | null;

    private shaderProgram: WebGLProgram | null;

    constructor(private gl2: WebGL2RenderingContext, private vertShaderSource: string, private fragShaderSource: string) {
        this.vShader = this.compileShader(ShaderType.VERTEX);
        this.fShader = this.compileShader(ShaderType.FRAGMENT);
        this.shaderProgram = this.createShaderProgram();
        if (this.shaderProgram) {
            console.log('Successfully compiled shader');
        }
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

    onDestroy() {
        this.cleanUp();
    }
}