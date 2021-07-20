import { mat4, vec3 } from 'gl-matrix';
import { Scene } from '../Scene';
import { SceneObject, Vector3 } from '../SceneObject';
import { Shader } from '../Shader';
import { Transform } from '../Transform';

export class Quad extends SceneObject {
    
    private vertices: Float32Array;
    private vBuffer: WebGLBuffer | null;
    private shader!: Shader;

    private vertexAttriLocation!: number;
    private timeUniformLocation!: WebGLUniformLocation | null;
    private mvpUniformLocation!: WebGLUniformLocation | null;

    constructor(scene3D: Scene, private p1: Vector3, private p2: Vector3, private p3: Vector3, private p4: Vector3) {
        super(scene3D);
        this.transform = new Transform();
        this.vertices = new Float32Array(
            [
                this.p1.x, this.p1.y, this.p1.z || 0,
                this.p2.x, this.p2.y, this.p2.z || 0,
                this.p4.x, this.p4.y, this.p4.z || 0,
                this.p4.x, this.p4.y, this.p4.z || 0,
                this.p2.x, this.p2.y, this.p2.z || 0,
                this.p3.x, this.p3.y, this.p3.z || 0,
            ]
        );

        this.vBuffer = this.gl2.createBuffer();
        if (!this.vBuffer) {
            console.error(`Couldn't allocate buffer for Quad`);
            return;
        }

        this.gl2.bindBuffer(this.gl2.ARRAY_BUFFER, this.vBuffer);
        this.gl2.bufferData(this.gl2.ARRAY_BUFFER, this.vertices, this.gl2.STATIC_DRAW);
        this.gl2.bindBuffer(this.gl2.ARRAY_BUFFER, null);

        this.shader = new Shader(this.gl2, require('../shaders/vertMvp/vert.glsl'), require('../shaders/vertMvp/frag.glsl'));
        if(!this.shader.ShaderProgram) {
            console.error(`Couldn't create a shader for Quad`);
            return;
        }

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
            this.gl2.uniformMatrix4fv(this.mvpUniformLocation, true, mvMatrix);

            this.gl2.bindBuffer(this.gl2.ARRAY_BUFFER, this.vBuffer);
            this.gl2.enableVertexAttribArray(this.vertexAttriLocation);
            this.gl2.vertexAttribPointer(this.vertexAttriLocation, 3, this.gl2.FLOAT, false, 0, 0);
            this.gl2.bindBuffer(this.gl2.ARRAY_BUFFER, null);

            this.gl2.drawArrays(this.gl2.TRIANGLES, 0, this.vertices.length /3 );
        }
    }

    onDestroy() {
        this.gl2.deleteBuffer(this.vBuffer);
        this.shader.onDestroy();
    }
}