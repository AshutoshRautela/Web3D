import { vec4 } from "gl-matrix";
import { EngineLifecycle } from "../../EngineLifeCycle";
import { Shader } from "../../Shader";
import { Texture2D } from "../../Texture2D/Texture2D";

export class PhoneShadingMaterial implements EngineLifecycle{

    private shader: Shader;
    private color: vec4 = vec4.create();

    private ambience: number = 0.3;
    private diffuse: number = 0.4;
    private specular: number = 0.2;
    private shininess: number = 20.0;

    private uniformColor: WebGLUniformLocation | null;
    private uniformAmbience: WebGLUniformLocation | null;
    private uniformDiffuse: WebGLUniformLocation | null;
    private uniformSpecular: WebGLUniformLocation | null;
    private uniformShininess: WebGLUniformLocation | null;

    private uniformSamplers: WebGLUniformLocation[];
    private uniformSamplerTriggers: WebGLUniformLocation[];
    private textures: Texture2D[];

    constructor(private gl2: WebGL2RenderingContext, textures?: Texture2D[]) { 
        this.textures = textures || [];
        this.uniformSamplers = [];
        this.uniformSamplerTriggers = [];

        if (this.textures) {
            this.textures.forEach((texture) => texture.onInit());

        }
        this.shader = new Shader(this.gl2, require('../../Shaders/vertMvp/vert.glsl'), require('../../Shaders/vertMvp/frag.glsl'));
        this.setColor(vec4.fromValues(1 , 1 ,1 , 1));
        this.initUniforms();
    }

    public setTexture(texture: Texture2D) {
        this.textures.push(texture);
        texture.onInit();
        this.updateTexCordsUniforms();
    }


    /**
     * Initialize Uniforms Locations for Material
     */
    private initUniforms(): void {
        this.uniformColor = this.gl2.getUniformLocation(this.shader.ShaderProgram, 'u_material.color');
        this.uniformAmbience = this.gl2.getUniformLocation(this.shader.ShaderProgram,
        'u_material.ambience');
        this.uniformDiffuse = this.gl2.getUniformLocation(this.shader.ShaderProgram,
        'u_material.diffuse');
        this.uniformSpecular = this.gl2.getUniformLocation(this.shader.ShaderProgram,
        'u_material.specular');
        this.uniformShininess = this.gl2.getUniformLocation(this.shader.ShaderProgram,
        'u_material.shininess');
        this.updateTexCordsUniforms();
    }

    private updateTexCordsUniforms() {
        if (this.textures.length > 0) {
            this.textures.forEach((texture, index) => {
                const uLocation = this.gl2.getUniformLocation(this.shader.ShaderProgram, `u_texture.tsampler`);
                this.uniformSamplers.push(uLocation);
                const uTriggerLocation = this.gl2.getUniformLocation(this.shader.ShaderProgram, `u_texture.tsampler_check`);
                this.uniformSamplerTriggers.push(uTriggerLocation);
            });
        }
    }

    /**
     * Setup the color of the material
     * @param color Color in vec3
     */
    public setColor(color: vec4) {
        vec4.set(this.color, color[0], color[1], color[2], 1.0);
    }

    /**
     * Setup the ambience strength of the material
     * @param ambience Ambiance Strength in number
     */
    public setAmbienceStrength(ambience: number) {
        this.ambience = ambience;
    }

    /**
     * Setup the diffuse strength of the material
     * @param diffuse Diffuse Strength in number
     */
    public setDiffuseStrength(diffuse: number) {
        this.diffuse = diffuse;
    }

    /**
     * Setup the specular strength of the material
     * @param specular Specular Strength in number
     */
    public setSpecularStrength(specular: number) {
        this.specular = specular;
    }

    /**
     * Setup the shininess strength of the material
     * @param shininess Shininess strength in number
     */
    public setShininessStrength(shininess: number) {
        this.shininess = shininess;
    }

    /**
     * Color of the material
     */
    public get Color(): vec4 {
        return this.color;
    }

    /**
     * Ambience Strength of the material
     */
    public get Ambience(): number {
        return this.ambience;
    }

    /**
     * Diffuse Strength of the material
     */
    public get Diffuse(): number {
        return this.diffuse;
    }

    /**
     * Specular Strength of the material
     */
    public get Specular(): number {
        return this.specular;
    }

    /**
     * Shininess of the material
     */
    public get Shininess(): number {
        return this.shininess;
    }

    /**
     * ShaderProgram
     */
    public get ShaderProgram(): WebGLProgram {
        return this.shader.ShaderProgram;
    }

    /**
     * Applying Material
     */
    public bind(): void {
        if (this.textures.length > 0) {
            this.textures.forEach((texture, index) => {
                texture.bind(index);
                this.gl2.uniform1i(this.uniformSamplers[index], index);
                this.gl2.uniform1i(this.uniformSamplerTriggers[index], 1);
            });
        }
        this.gl2.uniform4fv(this.uniformColor, this.color);
        this.gl2.uniform1f(this.uniformAmbience, this.ambience);
        this.gl2.uniform1f(this.uniformDiffuse, this.diffuse);
        this.gl2.uniform1f(this.uniformSpecular, this.specular);
        this.gl2.uniform1f(this.uniformShininess, this.shininess);
    }

    public unbind() {
        this.textures.length > 0 && this.textures.forEach((texture) => texture.unbind());
    }

    onDestroy() {
        this.shader.onDestroy();
    }
}