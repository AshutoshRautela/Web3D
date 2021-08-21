import { vec2, vec4 } from "gl-matrix";
import { Subject } from "rxjs";
import { EngineLifecycle } from "../../EngineLifeCycle";
import { Scene } from "../../SceneManagement";
import { Shader, Shaders } from "../../Shader";
import { Texture2D } from "../../Texture2D/Texture2D";

export enum MaterialEventType {
    ShaderUpdate = "ShaderUpdate"
}

export class PhongShadingMaterial implements EngineLifecycle {

    private shader: Shader;
    private color: vec4 = vec4.create();

    private ambience: number = 0.3;
    private diffuse: number = 0.4;
    private specular: number = 0.2;
    private shininess: number = 2.0;

    private uniformColor: WebGLUniformLocation | null;
    private uniformAmbience: WebGLUniformLocation | null;
    private uniformDiffuse: WebGLUniformLocation | null;
    private uniformSpecular: WebGLUniformLocation | null;
    private uniformShininess: WebGLUniformLocation | null;

    private uniformSamplers: WebGLUniformLocation[];
    private uniformSamplerTriggers: WebGLUniformLocation[];

    private textures: Texture2D[];

    private tilingUniformLocation: WebGLUniformLocation;
    private tiling: vec2;

    private materialEventDispatcher: Map<MaterialEventType, Subject<{}>>;

    constructor(private gl2: WebGL2RenderingContext, textures?: Texture2D[], shaderType?: Shaders) {
        this.setupMaterialEventDispatcher();
        this.textures = textures || [new Texture2D(this.gl2)];
        this.uniformSamplers = [];
        this.uniformSamplerTriggers = [];

        if (this.textures) {
            this.textures.forEach((texture) => texture.onInit());
        }
        this.shader = shaderType ? Shader.createShader(gl2, shaderType) : Shader.createShader(gl2, Shaders.StandardPhong);
        this.setColor(vec4.fromValues(1, 1, 1, 1));
        this.tiling = vec2.fromValues(1, 1);
        this.updateUniforms(this.shader.ShaderProgram);
    }

    private setupMaterialEventDispatcher() {
        this.materialEventDispatcher = new Map<MaterialEventType, Subject<{}>>();
        for (const val in MaterialEventType) {
            this.materialEventDispatcher.set(val as MaterialEventType, new Subject<{}>());
        }
    }

    addEventListener(eventType: MaterialEventType, callback: () => void) {
        this.materialEventDispatcher.get(eventType).subscribe(callback);
    }

    /**
     * Initialize Uniforms Locations for Material
     */
    private updateUniforms(program: WebGLProgram): void {
        if (this.shader?.ShaderProgram) {
            this.uniformColor = this.gl2.getUniformLocation(program, 'u_material.color');
            this.uniformAmbience = this.gl2.getUniformLocation(program, 'u_material.ambience');
            this.uniformDiffuse = this.gl2.getUniformLocation(program, 'u_material.diffuse');
            this.uniformSpecular = this.gl2.getUniformLocation(program, 'u_material.specular');
            this.uniformShininess = this.gl2.getUniformLocation(program, 'u_material.shininess');
            this.updateTexCordsUniforms(program);
        }
    }

    private updateTexCordsUniforms(program: WebGLProgram) {
        if (this.textures.length > 0 && this.shader?.ShaderProgram) {
            this.textures.forEach((texture, index) => {
                const uLocation = this.gl2.getUniformLocation(program, `u_texture.tsampler`);
                this.uniformSamplers.push(uLocation);
                const uTriggerLocation = this.gl2.getUniformLocation(program, `u_texture.tsampler_check`);
                this.uniformSamplerTriggers.push(uTriggerLocation);
            });
            this.tilingUniformLocation = this.gl2.getUniformLocation(program, 'u_tiling');
        }
    }

    /**
     * Setup the color of the material
     * @param color Color in vec3
     */
    public setColor(color: vec4): PhongShadingMaterial {
        vec4.set(this.color, color[0], color[1], color[2], 1.0);
        return this;
    }

    public setTexture(texturePath: string): Texture2D {
        const texture = new Texture2D(this.gl2, texturePath);
        this.textures[0] = texture;
        texture.onInit();
        this.updateTexCordsUniforms(this.shader.ShaderProgram);
        return texture;
    }

    public setTiling(tiling: vec2): PhongShadingMaterial {
        vec2.copy(this.tiling, tiling);
        return this;
    }

    /**
     * Setup the ambience strength of the material
     * @param ambience Ambiance Strength in number
     */
    public setAmbienceStrength(ambience: number): PhongShadingMaterial {
        this.ambience = ambience;
        return this;
    }

    /**
     * Setup the diffuse strength of the material
     * @param diffuse Diffuse Strength in number
     */
    public setDiffuseStrength(diffuse: number): PhongShadingMaterial {
        this.diffuse = diffuse;
        return this;
    }

    /**
     * Setup the specular strength of the material
     * @param specular Specular Strength in number
     */
    public setSpecularStrength(specular: number): PhongShadingMaterial {
        this.specular = specular;
        return this;
    }

    /**
     * Setup the shininess strength of the material
     * @param shininess Shininess strength in number
     */
    public setShininessStrength(shininess: number): PhongShadingMaterial {
        this.shininess = shininess;
        return this;
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
        return this.shader?.ShaderProgram;
    }
    
    /**
     * Applying Material
     */
    public bind(): void {
        if (this.shader?.ShaderProgram) {
            if (this.textures.length > 0) {
                this.textures.forEach((texture, index) => {
                    texture.bind(index);
                    this.gl2.uniform1i(this.uniformSamplers[index], index);
                    this.gl2.uniform1i(this.uniformSamplerTriggers[index], 1);
                });
                this.gl2.uniform2fv(this.tilingUniformLocation, this.tiling);
            }
            this.gl2.uniform4fv(this.uniformColor, this.color);
            this.gl2.uniform1f(this.uniformAmbience, this.ambience);
            this.gl2.uniform1f(this.uniformDiffuse, this.diffuse);
            this.gl2.uniform1f(this.uniformSpecular, this.specular);
            this.gl2.uniform1f(this.uniformShininess, this.shininess);
        }
    }

    public unbind() {
        this.textures.length > 0 && this.textures.forEach((texture) => texture.unbind());
    }

    onDestroy() {
        this.shader.onDestroy();
    }
}