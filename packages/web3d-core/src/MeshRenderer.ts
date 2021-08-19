import { EngineLifecycle } from "./EngineLifeCycle";
import { Mesh } from "./Mesh";

export class MeshRenderer implements EngineLifecycle {

    private vBuffer: WebGLBuffer | null;
    private eBuffer: WebGLBuffer | null;

    private vertex_AL: number;
    private normal_AL: number;
    private textCord_AL: number;

    private floatSizeInBytes = 4;
    private strideLength = 3;

    private vArrayObject: WebGLVertexArrayObject | null;
    private shaderProgram: WebGLProgram;

    constructor(private gl2: WebGL2RenderingContext, private mesh: Mesh) {
    }

    setShaderProgram(shaderProgram: WebGLProgram) {
        this.shaderProgram = shaderProgram;
    }

    public bind(): void {
        this.gl2.bindVertexArray(this.vArrayObject);
        this.gl2.enableVertexAttribArray(this.vertex_AL);
        this.mesh.ContainsNormals && this.gl2.enableVertexAttribArray(this.normal_AL);
        this.mesh.ContainsTextCords && this.gl2.enableVertexAttribArray(this.textCord_AL);
    }

    public draw() {
        if (this.shaderProgram) {
            this.bind();
            this.gl2.drawElements(
                this.gl2.TRIANGLES,
                this.mesh.Indices.length,
                this.gl2.UNSIGNED_SHORT,
                0
            );
            this.unbind();
        }
        else {
            console.warn("No shader program available");
        }
    }

    public unbind(): void {
        this.gl2.disableVertexAttribArray(this.vertex_AL);
        this.mesh.ContainsNormals && this.gl2.disableVertexAttribArray(this.normal_AL);
        this.mesh.ContainsTextCords && this.gl2.disableVertexAttribArray(this.textCord_AL);
        this.gl2.bindVertexArray(null);
    }

    onInit() {
        if (this.shaderProgram) {
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
            this.vertex_AL = this.gl2.getAttribLocation(this.shaderProgram, "a_position");
            this.normal_AL = this.gl2.getAttribLocation(this.shaderProgram, "a_normal");
            this.textCord_AL = this.gl2.getAttribLocation(this.shaderProgram, "a_texCord");

            this.gl2.bindVertexArray(this.vArrayObject);
            this.gl2.bindBuffer(this.gl2.ARRAY_BUFFER, this.vBuffer);
            this.gl2.bufferData(this.gl2.ARRAY_BUFFER, this.mesh.Vertices, this.gl2.STATIC_DRAW);

            this.gl2.bindBuffer(this.gl2.ELEMENT_ARRAY_BUFFER, this.eBuffer);
            this.gl2.bufferData(this.gl2.ELEMENT_ARRAY_BUFFER, this.mesh.Indices, this.gl2.STATIC_DRAW);

            this.mesh.ContainsNormals && (this.strideLength += 3);
            this.mesh.ContainsTextCords && (this.strideLength += 2);

            this.gl2.vertexAttribPointer(
                this.vertex_AL,
                3,
                this.gl2.FLOAT,
                false,
                this.strideLength * this.floatSizeInBytes,
                0
            );
            this.gl2.enableVertexAttribArray(this.vertex_AL);

            if (this.mesh.ContainsNormals) {
                this.gl2.vertexAttribPointer(
                    this.normal_AL,
                    3,
                    this.gl2.FLOAT,
                    true,
                    this.strideLength * this.floatSizeInBytes,
                    3 * this.floatSizeInBytes
                );
                this.gl2.enableVertexAttribArray(this.normal_AL);
            }

            if (this.mesh.ContainsTextCords) {
                this.gl2.vertexAttribPointer(
                    this.textCord_AL,
                    2,
                    this.gl2.FLOAT,
                    true,
                    this.strideLength * this.floatSizeInBytes,
                    6 * this.floatSizeInBytes
                );
                this.gl2.enableVertexAttribArray(this.textCord_AL);
            }

            this.gl2.bindBuffer(this.gl2.ARRAY_BUFFER, null);
            this.gl2.bindVertexArray(null);
            this.gl2.bindBuffer(this.gl2.ELEMENT_ARRAY_BUFFER, null);
        } else {
            console.warn("Couldn't Initialize Mesh Renderer!! No shader program available");
        }
    }

    onDestroy() {
        this.gl2.deleteBuffer(this.vBuffer);
        this.gl2.deleteBuffer(this.eBuffer);
        this.gl2.deleteVertexArray(this.vArrayObject);
    }
}