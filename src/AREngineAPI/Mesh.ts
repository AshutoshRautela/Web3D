import { EngineLifecycle } from "./EngineLifeCycle";
import { MeshData } from "./interfaces";
import { Scene } from "./Scene";
import { Vector3 } from "./SceneObject";

export class Mesh implements EngineLifecycle {
    private vertices: Float32Array;
    private indices: Uint16Array;

    private vBuffer: WebGLBuffer | null;
    private eBuffer: WebGLBuffer | null;

    private vArrayObject: WebGLVertexArrayObject | null;
    private gl2: WebGL2RenderingContext;

    private vertex_AL: number;
    private normal_AL: number;

    private floatSizeInBytes = 4;

    private containsNormals: boolean = false;

    constructor(
        private scene3D: Scene,
        private shaderProgram: WebGLProgram,
        meshData: MeshData
    ) {
        console.log("Recieved Mesh Data: ", meshData);

        let vertArray = meshData.vertices;
        
        const normals = meshData.normals;
        this.containsNormals = meshData.normals ? true : false;

        console.log("Recevied Normals: ", normals);

        if (this.containsNormals) {
            vertArray = vertArray.map((vertex, index) => [
                ...vertex,
                ...normals[index],
            ]);
            console.log("Prepared Vertex Arra: ", vertArray);
        }

        this.vertices = Float32Array.from(vertArray.flat());
        this.indices = Uint16Array.from(meshData.indices);
        this.gl2 = this.scene3D.WebGLContext;
    }

    onInit() {
        this.vBuffer = this.gl2.createBuffer();
        if (!this.vBuffer) {
            console.error(`Couldn't allocate buffer!`);
            return;
        }
        this.eBuffer = this.gl2.createBuffer();
        if (!this.eBuffer) {
            console.error(`Couldn't allocate buffer!`);
            return;
        }
        this.vArrayObject = this.gl2.createVertexArray();
        if (!this.vArrayObject) {
            console.error(`Couldn't create Vertex Array Object`);
            return;
        }

        // Getting Attrib Locations
        this.vertex_AL = this.gl2.getAttribLocation(
            this.shaderProgram,
            "a_position"
        );
        this.normal_AL = this.gl2.getAttribLocation(
            this.shaderProgram, 
            "a_normal"
        );
        console.log("Normal Attrib Location: ", this.normal_AL, this.vertex_AL);


        this.gl2.bindVertexArray(this.vArrayObject);
        this.gl2.bindBuffer(this.gl2.ARRAY_BUFFER, this.vBuffer);
        this.gl2.bufferData(
            this.gl2.ARRAY_BUFFER,
            this.vertices,
            this.gl2.STATIC_DRAW
        );

        this.gl2.bindBuffer(this.gl2.ELEMENT_ARRAY_BUFFER, this.eBuffer);
        this.gl2.bufferData(
            this.gl2.ELEMENT_ARRAY_BUFFER,
            this.indices,
            this.gl2.STATIC_DRAW
        );

        this.gl2.vertexAttribPointer(
            this.vertex_AL,
            3,
            this.gl2.FLOAT,
            false,
            6 * this.floatSizeInBytes,
            0
        );
        this.gl2.vertexAttribPointer(
            this.normal_AL,
            3,
            this.gl2.FLOAT,
            true,
            6 * this.floatSizeInBytes,
            3 * this.floatSizeInBytes
        );
        this.gl2.enableVertexAttribArray(this.vertex_AL);
        this.gl2.enableVertexAttribArray(this.normal_AL);

        this.gl2.bindBuffer(this.gl2.ARRAY_BUFFER, null);
        this.gl2.bindVertexArray(null);
        this.gl2.bindBuffer(this.gl2.ELEMENT_ARRAY_BUFFER, null);
    }

    public bind() {
        this.gl2.bindVertexArray(this.vArrayObject);
        this.gl2.enableVertexAttribArray(this.vertex_AL);
        this.gl2.enableVertexAttribArray(this.normal_AL);
    }

    public unbind() {
        this.gl2.disableVertexAttribArray(this.vertex_AL);
        this.gl2.disableVertexAttribArray(this.normal_AL);
        this.gl2.bindVertexArray(null);
    }

    public draw() {
        this.bind();
        // this.gl2.drawArrays(this.gl2.TRIANGLES, 0, this.vertices.length / 3);
        this.gl2.drawElements(
            this.gl2.TRIANGLES,
            this.indices.length,
            this.gl2.UNSIGNED_SHORT,
            0
        );
        this.unbind();
    }

    onDestroy() {
        this.gl2.deleteBuffer(this.vBuffer);
    }
}
