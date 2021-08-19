interface ObjData {
  meshdata: {
    vertices: number[][];
    normals: number[][];
    texCords?: number[][];
    indices: number[];
  };
  raw: {
    rvertices: number[][];
    rtextCords: number[][];
    rnormals: number[][];
    rfaces: number[][];
  }
}

declare module "*.obj" {
    const value: ObjData; // Add better type definitions here if desired.
    export default value;
}