import { Vector3 } from "./SceneObject";

export interface MeshData {

    vertices: number[][],
    indices: number[];
    normals?: number[][];
    texCords?: number[][];

}