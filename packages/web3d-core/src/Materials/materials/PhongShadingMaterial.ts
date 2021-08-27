import { mat4, vec2, vec4 } from "gl-matrix";
import { Subject } from "rxjs";
import { PointLight } from "../../Lights";
import { DirectionalLight } from "../../Lights/lights/DirectionalLight";
import { Scene, SceneEventType } from "../../SceneManagement";
import { Shader, Shaders } from "../../Shader";
import { Model } from "../../Shapes";
import { Texture2D } from "../../Textures/texture/Texture2D";
import { Time } from "../../Time";
import { Material } from "./Material";

export enum MaterialEventType {
    ShaderUpdate = "ShaderUpdate"
}

export class PhongShadingMaterial extends Material {

    private color: vec4 = vec4.create();

    private ambience: number = 0.3;
    private diffuse: number = 0.4;
    private specular: number = 0.2;
    private shininess: number = 2.0;

    private timeUniformLocation!: WebGLUniformLocation | null;
    private mvpUniformLocation!: WebGLUniformLocation | null;
    private modelUniformLocation: WebGLUniformLocation | null;

    private uniformColor: WebGLUniformLocation | null;
    private uniformAmbience: WebGLUniformLocation | null;
    private uniformDiffuse: WebGLUniformLocation | null;
    private uniformSpecular: WebGLUniformLocation | null;
    private uniformShininess: WebGLUniformLocation | null;

    private uniformSamplers: WebGLUniformLocation[];
    private uniformSamplerTriggers: WebGLUniformLocation[];

    private uniformDLightsCount: WebGLUniformLocation;
    private uniformDLightsColor: WebGLUniformLocation[] = [];
    private uniformDLightsDirection: WebGLUniformLocation[] = [];
    private uniformDLightsIntensity: WebGLUniformLocation[] = [];

    private uniformPLightsCount: WebGLUniformLocation;
    private uniformPLightsColor: WebGLUniformLocation[] = [];
    private uniformPLightsPosition: WebGLUniformLocation[] = [];
    private uniformPLightsIntensity: WebGLUniformLocation[] = [];
    private uniformPLightsAttenC: WebGLUniformLocation[] = [];

    private textures: Texture2D[];

    private tilingUniformLocation: WebGLUniformLocation;
    private tiling: vec2;

    private materialEventDispatcher: Map<MaterialEventType, Subject<{}>>;

    constructor(protected scene3D: Scene, private model: Model, textures?: Texture2D[], shaderType?: Shaders) {
        super(scene3D, shaderType);
        this.gl2 = this.scene3D.WebGLContext;
        this.setupMaterialEventDispatcher();
        this.textures = textures || [new Texture2D(this.gl2)];
        this.uniformSamplers = [];
        this.uniformSamplerTriggers = [];

        if (this.textures) {
            this.textures.forEach((texture) => texture.onInit());
        }
        this.shader = shaderType ? Shader.createShader(this.gl2, shaderType) : Shader.createShader(this.gl2, Shaders.StandardPhong);
        this.setColor(vec4.fromValues(1, 1, 1, 1));
        this.tiling = vec2.fromValues(1, 1);
        this.updateUniforms(this.shader.ShaderProgram);

        this.scene3D.addEventListener(SceneEventType.OnLightAdd, this.initLightsUniforms.bind(this));
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
            this.timeUniformLocation = this.gl2.getUniformLocation(program, 'u_time');
            this.mvpUniformLocation = this.gl2.getUniformLocation(program, 'u_mvp');
            this.modelUniformLocation = this.gl2.getUniformLocation(program, 'u_model');

            this.initLightsUniforms();

            this.uniformColor = this.gl2.getUniformLocation(program, 'u_material.color');
            this.uniformAmbience = this.gl2.getUniformLocation(program, 'u_material.ambience');
            this.uniformDiffuse = this.gl2.getUniformLocation(program, 'u_material.diffuse');
            this.uniformSpecular = this.gl2.getUniformLocation(program, 'u_material.specular');
            this.uniformShininess = this.gl2.getUniformLocation(program, 'u_material.shininess');
            this.updateTexCordsUniforms(program);
        }
    }

    private initLightsUniforms(): void {
        if (this.shader?.ShaderProgram) {
            this.uniformDLightsCount = this.gl2.getUniformLocation(this.shader.ShaderProgram, 'u_dLights.numLights');
            this.scene3D.DirectionalLights.forEach((dLight: DirectionalLight, index: number) => {
                this.uniformDLightsColor.push(this.gl2.getUniformLocation(this.shader.ShaderProgram, `u_dLights.lights[${index}].color`));
                this.uniformDLightsDirection.push(this.gl2.getUniformLocation(this.shader.ShaderProgram, `u_dLights.lights[${index}].direction`));
                this.uniformDLightsIntensity.push(this.gl2.getUniformLocation(this.shader.ShaderProgram, `u_dLights.lights[${index}].intensity`));
            });

            this.uniformPLightsCount = this.gl2.getUniformLocation(this.shader.ShaderProgram, 'u_pLights.numLights');
            this.scene3D.PointLights.forEach((pLight: PointLight, index: number) => {
                this.uniformPLightsColor.push(this.gl2.getUniformLocation(this.shader.ShaderProgram, `u_pLights.lights[${index}].color`));
                this.uniformPLightsPosition.push(this.gl2.getUniformLocation(this.shader.ShaderProgram, `u_pLights.lights[${index}].position`));
                this.uniformPLightsIntensity.push(this.gl2.getUniformLocation(this.shader.ShaderProgram, `u_pLights.lights[${index}].intensity`));
                this.uniformPLightsAttenC.push(this.gl2.getUniformLocation(this.shader.ShaderProgram, `u_pLights.lights[${index}].attenuationCoeff`));
            });
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
     * Applying Material
     */
    public bind(): void {
        if (this.shader?.ShaderProgram) {
            let mvMatrix: mat4 = mat4.create();
            mvMatrix = mat4.multiply(mvMatrix, this.scene3D.RenderCamera.ProjectionMatrix, this.scene3D.RenderCamera.ViewMatrix);
            mvMatrix = mat4.multiply(mvMatrix, mvMatrix, this.model.Transform.ModelMatrix);

            this.gl2.useProgram(this.ShaderProgram);

            this.gl2.uniform1f(this.timeUniformLocation, Time.time);
            this.gl2.uniformMatrix4fv(this.mvpUniformLocation, false, mvMatrix);
            this.gl2.uniformMatrix4fv(this.modelUniformLocation, false, this.model.Transform.ModelMatrix);

            if (this.scene3D.PointLights.length > 0) {
                console.log("Setting Lights Uniform ", this.scene3D.PointLights.length);
                this.gl2.uniform1i(this.uniformPLightsCount, this.scene3D.PointLights.length);
                this.scene3D.PointLights.forEach((pointLight: PointLight, index: number) => {
                    this.gl2.uniform3fv(this.uniformPLightsColor[index], pointLight.Color);
                    this.gl2.uniform3fv(this.uniformPLightsPosition[index], pointLight.Position);
                    this.gl2.uniform1f(this.uniformPLightsIntensity[index], pointLight.Intensity);
                    this.gl2.uniform3fv(this.uniformPLightsAttenC[index], pointLight.AttenuationCoeff);
                });
            };
            if (this.scene3D.DirectionalLights.length > 0) {
                this.gl2.uniform1i(this.uniformDLightsCount, this.scene3D.DirectionalLights.length);
                this.scene3D.DirectionalLights.forEach((directionLight: DirectionalLight, index: number) => {
                    this.gl2.uniform3fv(this.uniformDLightsColor[index], directionLight.Color);
                    this.gl2.uniform3fv(this.uniformDLightsDirection[index], directionLight.Direction);
                    this.gl2.uniform1f(this.uniformDLightsIntensity[index], directionLight.Intensity);
                });
            }

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