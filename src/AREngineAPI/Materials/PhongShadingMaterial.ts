import { vec3, vec4 } from "gl-matrix";

export class PhoneShadingMaterial {

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

    private uniformMap: Map<string, WebGLUniformLocation>;

    constructor(private gl2: WebGL2RenderingContext, private shaderProgram: WebGLProgram) { 
        this.setColor(vec4.fromValues(1 , 1 ,1 , 1));
        this.initUniforms();
    }

    /**
     * Initialize Uniforms Locations for Material
     */
    private initUniforms(): void {
        this.uniformMap = new Map<string, WebGLUniformLocation>();

        this.uniformMap.set('u_material.color', this.uniformColor);
        this.uniformMap.set('u_material.ambience', this.uniformAmbience);
        this.uniformMap.set('u_material.diffuse', this.uniformDiffuse);
        this.uniformMap.set('u_material.specular', this.uniformSpecular);
        this.uniformMap.set('u_material.shininess', this.uniformShininess);

        this.uniformMap.forEach((value, key) => {
            value = this.gl2.getUniformLocation(this.shaderProgram, key);
        });

        this.uniformColor = this.gl2.getUniformLocation(this.shaderProgram, 'u_material.color');
        this.uniformAmbience = this.gl2.getUniformLocation(this.shaderProgram,
        'u_material.ambience');
        this.uniformDiffuse = this.gl2.getUniformLocation(this.shaderProgram,
        'u_material.diffuse');
        this.uniformSpecular = this.gl2.getUniformLocation(this.shaderProgram,
        'u_material.specular');
        this.uniformShininess = this.gl2.getUniformLocation(this.shaderProgram,
        'u_material.shininess');
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
     * Applying Material
     */
    public onUpdate(): void {
        console.log("Color U: ", this.uniformColor);
        this.gl2.uniform4fv(this.uniformColor, this.color);
        this.gl2.uniform1f(this.uniformAmbience, this.ambience)
        this.gl2.uniform1f(this.uniformDiffuse, this.diffuse);
        this.gl2.uniform1f(this.uniformSpecular, this.specular);
        this.gl2.uniform1f(this.uniformShininess, this.shininess);
    }
}