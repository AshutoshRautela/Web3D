import { MeshData } from "./interfaces";
export class Mesh {
    private vertices: Float32Array;
    private indices: Uint16Array;

    private containsNormals: boolean = false;
    private containsTextCords: boolean = false;

    constructor(meshData: MeshData) {
        let vertArray = meshData.vertices;
        const normals = meshData.normals;
        this.containsNormals = meshData.normals ? true : false;

        const textCords = meshData.texCords;
        this.containsTextCords = meshData.texCords ? true : false;

        if (this.containsNormals) {
            vertArray = vertArray.map((vertex, index) => [
                ...vertex,
                ...normals[index],
            ]);
        }
        if (this.containsTextCords) {
            vertArray = vertArray.map((vertex, index) => [
                ...vertex,
                ...textCords[index]
            ]);
        }

        this.vertices = Float32Array.from(vertArray.flat()); // Mesh Vertices
        this.indices = Uint16Array.from(meshData.indices);  // Mesh Indices
    }
  
    public get Vertices(): Float32Array {
        return this.vertices;
    }

    public get Indices(): Uint16Array {
        return this.indices;
    }

    public get ContainsNormals(): boolean {
        return this.containsNormals;
    }

    public get ContainsTextCords(): boolean {
        return this.containsTextCords;
    }
}
