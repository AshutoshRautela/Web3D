import { vec2, vec3 } from "gl-matrix";
import { EngineLifecycle } from "./EngineLifeCycle";
import { MeshData } from "./interfaces";
import { Scene } from "./Scene";
import { Vector3 } from "./SceneObject";

export class Mesh implements EngineLifecycle {

    private vertices: Float32Array;
    private vBuffer: WebGLBuffer | null;
    private gl2: WebGL2RenderingContext;

    constructor(private scene3D: Scene, meshData: MeshData) {
        console.log("Recieved Mesh Data: ", meshData);

        const vertArray = meshData.vertices.map((vertex: Vector3) => [vertex.x , vertex.y, vertex.z]);
        this.vertices = Float32Array.from(vertArray.flat());
        this.gl2 = this.scene3D.WebGLContext;
    }

    onInit() {
        this.vBuffer = this.gl2.createBuffer();
        if (!this.vBuffer) {
            console.error("Couldn't allocate buffer!");
            return;
        }

        this.gl2.bindBuffer(this.gl2.ARRAY_BUFFER, this.vBuffer);
        this.gl2.bufferData(this.gl2.ARRAY_BUFFER, this.vertices, this.gl2.STATIC_DRAW);
        this.gl2.bindBuffer(this.gl2.ARRAY_BUFFER, null);
    }

    public bind() {
        this.gl2.bindBuffer(this.gl2.ARRAY_BUFFER, this.vBuffer);
    }

    public unbind() {
        this.gl2.bindBuffer(this.gl2.ARRAY_BUFFER, null);
    }

    public draw() {
        this.gl2.drawArrays(this.gl2.TRIANGLES, 0, this.vertices.length / 3);
    }

    onDestroy() {
        this.gl2.deleteBuffer(this.vBuffer);
    }
}