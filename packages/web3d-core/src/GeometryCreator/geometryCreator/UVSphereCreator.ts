import { vec3 } from "gl-matrix";
import { normalize } from "path";
import { MeshData } from "../../interfaces";
import { Util } from "../../Util";

export class UVSphereCreator {

    public static createGeometry(radius = 1, step = 20): MeshData {
        const vertices: number[][] = [];
        const indices = new Array<number>();
        const normals: number[][] = [];

        for (let i = 0; i <= 180; i+= step) {
            for (let j = 0; j <= 360; j+= step) {
                let id = Util.DegreesToRadians(j);
                let jd = Util.DegreesToRadians(i);

                let x = radius * Math.cos(id) * Math.sin(jd);
                let z = radius * Math.sin(id) * Math.sin(jd);
                let y = radius * Math.cos(jd);
                
                const point: vec3 = vec3.fromValues(x , y , z);
                vertices.push([x , y , z]);

                let normal: vec3 = vec3.create();
                normal = vec3.normalize(normal, point);
                let n1 = Number(normal[0]);
                let n2 = Number(normal[1]);
                let n3 = Number(normal[2]);

                normals.push([n1, n2, n3]);
            }
        }

        let pArr = (360 / step) + 1;
        for (let i = pArr; i < vertices.length - 1; i++) {
            let p1 = i; let p2 = i - pArr; let p3 = ( i - pArr ) + 1;
            let pp1 = i; let pp2 = ( i - pArr ) + 1; let pp3 = i + 1;

            indices.push(...[p1, p2, p3, pp1, pp2, pp3]);
        }

        return { vertices, indices, normals };
    }
}