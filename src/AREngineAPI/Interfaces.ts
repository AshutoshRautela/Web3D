import { Vector3 } from "./SceneObject";

export interface MeshData {

    vertices: Vector3[],
    indices: number[];
    normals?: number[][];

}