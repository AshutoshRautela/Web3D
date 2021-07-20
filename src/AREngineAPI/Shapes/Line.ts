import { Scene } from '../Scene';
import { SceneObject, Vector3 } from '../SceneObject';
import { Shader } from '../Shader';

export class Line extends SceneObject {

    private vertices: Float32Array;
    private vBuffer: WebGLBuffer | null;
    private shader!: Shader;

    private vertexAttribLocation!: number;
    private colorUniformLocation!: WebGLUniformLocation | null;

    constructor(scene3D: Scene,private points: Vector3[]) {
        super(scene3D);
        const test = this.points.map(point => [point.x, point.y, point.z || 0]);
        this.vertices = Float32Array.from(test.flat());

        console.log( "Lines Vertices: ", this.vertices, this.vertices.length / 3 );

        this.vBuffer = this.gl2.createBuffer();
        if (!this.vBuffer) {
            console.error(`Couldn't allocate buffer for Line`);
            return;
        }

        this.gl2.bindBuffer(this.gl2.ARRAY_BUFFER, this.vBuffer);
        this.gl2.bufferData(this.gl2.ARRAY_BUFFER, this.vertices, this.gl2.STATIC_DRAW);
        this.gl2.bindBuffer(this.gl2.ARRAY_BUFFER, null);

        this.shader = new Shader(this.gl2, require('../shaders/vert.glsl'), require('../shaders/colorAnimation/frag.glsl'));
        if(!this.shader.ShaderProgram) {
            console.error(`Couldn't create a shader for Line`);
            return;
        }

        this.vertexAttribLocation = this.gl2.getAttribLocation(this.shader.ShaderProgram, 'a_position');
        this.colorUniformLocation = this.gl2.getUniformLocation(this.shader.ShaderProgram, 'u_time');
    }

    onRender() {
        if (this.shader.ShaderProgram) {
            this.gl2.useProgram(this.shader.ShaderProgram);
            this.gl2.uniform1f(this.colorUniformLocation, performance.now() / 1000);

            this.gl2.bindBuffer(this.gl2.ARRAY_BUFFER, this.vBuffer);
            this.gl2.enableVertexAttribArray(this.vertexAttribLocation);
            this.gl2.vertexAttribPointer(this.vertexAttribLocation, 3, this.gl2.FLOAT, true, 0, 0);
            this.gl2.bindBuffer(this.gl2.ARRAY_BUFFER, null);

            this.gl2.drawArrays(this.gl2.LINE_STRIP, 0, this.vertices.length /3 );
        }
    }

    onDestroy() {
        this.gl2.deleteBuffer(this.vBuffer);
        this.shader.onDestroy();
    }
}