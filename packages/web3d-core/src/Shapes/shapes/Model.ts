import { mat4 } from "gl-matrix";
import { DirectionalLight, PointLight } from "../../Lights";
import { PhongShadingMaterial } from "../../Materials";
import { Scene, SceneEventType } from "../../SceneManagement";
import { SceneObject } from "../../SceneObject";
import { Transform } from "../../Transform";
import { MeshRenderer } from "../../MeshRenderer";
import { Mesh } from "../../Mesh";

export  class Model extends SceneObject {

    protected material: PhongShadingMaterial;

    private timeUniformLocation!: WebGLUniformLocation | null;
    private mvpUniformLocation!: WebGLUniformLocation | null;
    private modelUniformLocation: WebGLUniformLocation | null;
    
    private uniformDLightsCount: WebGLUniformLocation;
    private uniformDLightsColor: WebGLUniformLocation[] = [];
    private uniformDLightsDirection: WebGLUniformLocation[] = [];
    private uniformDLightsIntensity: WebGLUniformLocation[] = [];

    private uniformPLightsCount: WebGLUniformLocation;
    private uniformPLightsColor: WebGLUniformLocation[] = [];
    private uniformPLightsPosition: WebGLUniformLocation[] = [];
    private uniformPLightsIntensity: WebGLUniformLocation[] = [];
    private uniformPLightsAttenC: WebGLUniformLocation[] = [];

    constructor(scene3D: Scene,
         protected meshRenderer: MeshRenderer,
    ) {
        super(scene3D);
        this.material = new PhongShadingMaterial(this.gl2);
        this.transform = new Transform();
        this.meshRenderer.setShaderProgram(this.material.ShaderProgram);
        this.meshRenderer.onInit();
        this.initUniforms();

        scene3D.addEventListener(SceneEventType.OnLightAdd, () => {
            this.initUniforms();
        });
    }

    private initUniforms() {
        this.timeUniformLocation = this.gl2.getUniformLocation(this.material.ShaderProgram, 'u_time');
        this.mvpUniformLocation = this.gl2.getUniformLocation(this.material.ShaderProgram, 'u_mvp');
        this.modelUniformLocation = this.gl2.getUniformLocation(this.material.ShaderProgram, 'u_model');
        
        this.uniformDLightsCount = this.gl2.getUniformLocation(this.material.ShaderProgram, 'u_dLights.numLights');
        this.scene3D.DirectionalLights.forEach((dLight: DirectionalLight, index: number) => {
            this.uniformDLightsColor.push(this.gl2.getUniformLocation(this.material.ShaderProgram, `u_dLights.lights[${index}].color`));
            this.uniformDLightsDirection.push(this.gl2.getUniformLocation(this.material.ShaderProgram, `u_dLights.lights[${index}].direction`));
            this.uniformDLightsIntensity.push(this.gl2.getUniformLocation(this.material.ShaderProgram, `u_dLights.lights[${index}].intensity`));
        });

        this.uniformPLightsCount = this.gl2.getUniformLocation(this.material.ShaderProgram, 'u_pLights.numLights');
        this.scene3D.PointLights.forEach((pLight: PointLight, index: number) => {
            this.uniformPLightsColor.push(this.gl2.getUniformLocation(this.material.ShaderProgram, `u_pLights.lights[${index}].color`));
            this.uniformPLightsPosition.push(this.gl2.getUniformLocation(this.material.ShaderProgram, `u_pLights.lights[${index}].position`));
            this.uniformPLightsIntensity.push(this.gl2.getUniformLocation(this.material.ShaderProgram, `u_pLights.lights[${index}].intensity`));
            this.uniformPLightsAttenC.push(this.gl2.getUniformLocation(this.material.ShaderProgram, `u_pLights.lights[${index}].attenuationCoeff`));
        });       
    }

    static createRenderableMode(scene3D: Scene, mesh: Mesh): Model {
        const meshRenderer = new MeshRenderer(scene3D.WebGLContext, mesh);
        const model = new Model(scene3D, meshRenderer);
        return model;
    }

    onRender(deltaTime: number) {
        if (this.material.ShaderProgram) {
            this.transform.onRender();

            let mvMatrix: mat4 =  mat4.create();
            mvMatrix = mat4.multiply(mvMatrix, this.scene3D.RenderCamera.ProjectionMatrix, this.scene3D.RenderCamera.ViewMatrix);
            mvMatrix = mat4.multiply(mvMatrix, mvMatrix, this.transform.ModelMatrix);

            this.gl2.useProgram(this.material.ShaderProgram);

            this.gl2.uniform1f(this.timeUniformLocation, performance.now() / 500);
            this.gl2.uniformMatrix4fv(this.mvpUniformLocation, false, mvMatrix);
            this.gl2.uniformMatrix4fv(this.modelUniformLocation, false, this.transform.ModelMatrix);
            
            if (this.scene3D.PointLights.length > 0) {
                this.gl2.uniform1i(this.uniformPLightsCount, this.scene3D.PointLights.length );
                this.scene3D.PointLights.forEach((pointLight: PointLight, index: number) => {
                    this.gl2.uniform3fv(this.uniformPLightsColor[index], pointLight.Color);
                    this.gl2.uniform3fv(this.uniformPLightsPosition[index], pointLight.Position);
                    this.gl2.uniform1f(this.uniformPLightsIntensity[index], pointLight.Intensity);
                    this.gl2.uniform3fv(this.uniformPLightsAttenC[index], pointLight.AttenuationCoeff);
                });
            };
            if (this.scene3D.DirectionalLights.length > 0) {
                this.gl2.uniform1i(this.uniformDLightsCount, this.scene3D.DirectionalLights.length );
                this.scene3D.DirectionalLights.forEach((directionLight: DirectionalLight, index: number) => {
                    this.gl2.uniform3fv(this.uniformDLightsColor[index], directionLight.Color);
                    this.gl2.uniform3fv(this.uniformDLightsDirection[index], directionLight.Direction);
                    this.gl2.uniform1f(this.uniformDLightsIntensity[index], directionLight.Intensity);
                });
            }
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