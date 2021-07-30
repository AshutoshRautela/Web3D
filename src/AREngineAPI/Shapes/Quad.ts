import { mat4, vec3 } from 'gl-matrix';
import { DirectionalLight } from '../Lights/DirectionalLight';
import { SpotLight } from '../Lights/SpotLight';
import { Mesh } from '../Mesh';
import { Scene } from '../Scene';
import { SceneObject, Vector3 } from '../SceneObject';
import { Shader } from '../Shader';
import { Transform } from '../Transform';
export class Quad extends SceneObject {

    private shader!: Shader;
    private mesh: Mesh;

    private timeUniformLocation!: WebGLUniformLocation | null;
    private mvpUniformLocation!: WebGLUniformLocation | null;
    private modelUniformLocation: WebGLUniformLocation | null;

    private lightDirUniformLocation: WebGLUniformLocation | null;
    private lightPosUniformLocation: WebGLUniformLocation | null;

    constructor(scene3D: Scene) {
        super(scene3D);
        this.transform = new Transform();
        this.shader = new Shader(this.gl2, require('../shaders/vertMvp/vert.glsl'), require('../shaders/vertMvp/frag.glsl'));
        if(!this.shader.ShaderProgram) {
            throw "Failed to create Shader for QUad";
        }

        this.mesh = new Mesh(this.scene3D, this.shader.ShaderProgram, require('../MeshFiles/QuadMesh_D.json'));
        this.mesh.onInit();

        this.timeUniformLocation = this.gl2.getUniformLocation(this.shader.ShaderProgram, 'u_time');
        this.mvpUniformLocation = this.gl2.getUniformLocation(this.shader.ShaderProgram, 'u_mvp');
        this.modelUniformLocation = this.gl2.getUniformLocation(this.shader.ShaderProgram, 'u_model');

        this.lightDirUniformLocation = this.gl2.getUniformLocation(this.shader.ShaderProgram, 'u_dLight.direction');
        this.lightPosUniformLocation = this.gl2.getUniformLocation(this.shader.ShaderProgram, 'u_sLight.position');

        console.log("Light Direction: ", this.lightDirUniformLocation);
    }

    onRender(deltaTime: number) {
        if (this.shader.ShaderProgram) {
            this.transform.onRender();

            let mvMatrix: mat4 =  mat4.create();
            mvMatrix = mat4.multiply(mvMatrix, this.scene3D.RenderCamera.ProjectionMatrix, this.scene3D.RenderCamera.ViewMatrix);
            mvMatrix = mat4.multiply(mvMatrix, mvMatrix, this.transform.ModelMatrix);

            this.gl2.useProgram(this.shader.ShaderProgram);

            this.gl2.uniform1f(this.timeUniformLocation, performance.now() / 500 );
            this.gl2.uniformMatrix4fv(this.mvpUniformLocation, false, mvMatrix);
            this.gl2.uniformMatrix4fv(this.modelUniformLocation, false, this.transform.ModelMatrix);
            if (this.scene3D.Light instanceof DirectionalLight) {
                this.gl2.uniform3fv(this.lightDirUniformLocation, (this.scene3D.Light as DirectionalLight).Direction);
            } else if (this.scene3D.Light instanceof SpotLight) {
                this.gl2.uniform3fv(this.lightPosUniformLocation, (this.scene3D.Light as SpotLight).Position);
            }
            this.mesh.draw();
        }
    }

    onDestroy() {
        this.mesh.onDestroy();
        this.shader.onDestroy();
    }
}