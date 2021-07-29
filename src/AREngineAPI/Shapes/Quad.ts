import { mat4, vec3 } from 'gl-matrix';
import { Mesh } from '../Mesh';
import { Scene } from '../Scene';
import { SceneObject, Vector3 } from '../SceneObject';
import { Shader } from '../Shader';
import { Transform } from '../Transform';
export class Quad extends SceneObject {
    
    private vertices: Float32Array;
    private vBuffer: WebGLBuffer | null;
    private shader!: Shader;
    private mesh: Mesh;

    private vertexAttriLocation!: number;
    private timeUniformLocation!: WebGLUniformLocation | null;
    private mvpUniformLocation!: WebGLUniformLocation | null;

    constructor(scene3D: Scene, private p1: Vector3, private p2: Vector3, private p3: Vector3, private p4: Vector3) {
        super(scene3D);
        this.transform = new Transform();
        this.shader = new Shader(this.gl2, require('../shaders/vertMvp/vert.glsl'), require('../shaders/vertMvp/frag.glsl'));
        if(!this.shader.ShaderProgram) {
            console.error(`Couldn't create a shader for Quad`);
            return;
        }
        
        this.mesh = new Mesh(this.scene3D, this.shader.ShaderProgram, require('../MeshFiles/QuadMesh.json'));
        this.mesh.onInit();
        this.vertexAttriLocation = this.gl2.getAttribLocation(this.shader.ShaderProgram, 'a_position');
        this.timeUniformLocation = this.gl2.getUniformLocation(this.shader.ShaderProgram, 'u_time');
        this.mvpUniformLocation = this.gl2.getUniformLocation(this.shader.ShaderProgram, 'u_mvp');
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
            
            this.mesh.draw();
        }
    }

    onDestroy() {
        // this.gl2.deleteBuffer(this.vBuffer);
        this.mesh.onDestroy();
        this.shader.onDestroy();
    }
}