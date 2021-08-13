import { vec3 } from "gl-matrix";
import { Util } from "../../Util";

export class CylinderCreator {

    public static createGeometry(hSegments: number = 3, vSegments: number = 20) {
        let radius = 1.0;
        let vSplit = 360 / vSegments;

        let hSplit = 1.0 / (hSegments + 1);

        const vertices: number[][] = []
        const indices: Array<number> = [];
        const normals: number[][] = [];

        let cPoint = 0;
        // Vertices for Cylinder Body
        for (let j = 1.0; j >= 0.0; j -= hSplit) {
            for (let i = 0; i <= 360; i += vSplit) {
                if (j == 1) cPoint++;

                let angle = Util.DegreesToRadians(i);

                let x = Number((radius * Math.cos(angle)).toPrecision(2));
                let z = Number((radius * Math.sin(angle)).toPrecision(2));
                let y = (j - 0.5) * 2.0;

                const point = vec3.fromValues(x,y,z);
                vertices.push([x,y,z]);

                let normal = vec3.create();
                normal = vec3.normalize(normal, point);
                let x1 = Number(normal[0].toPrecision(2));
                let y1 = Number(normal[1].toPrecision(2));
                let z1 = Number(normal[2].toPrecision(2));
                normals.push([x1,y1,z1]);
            }
        }

        let pArr = cPoint;
        // Indices for Cylinder Body
        for (let i = pArr; i < vertices.length - 1; i++) {
            let p1 = i; let p2 = i - pArr; let p3 = (i - pArr) + 1;
            let pp1 = i; let pp2 = (i - pArr) + 1; let pp3 = i + 1;
            indices.push(...[p1, p2, p3, pp1, pp2, pp3]);
        }

        // Vertices for Cylinder Base
        for (let i = 0; i <= 360; i += vSplit) {
            let angle = Util.DegreesToRadians(i);
            let x = Number((radius * Math.cos(angle)).toPrecision(2));
            let z = Number((radius * Math.sin(angle)).toPrecision(2));
            let y = (0.0 - 0.5) * 2.0;


            vertices.push([x,y,z]);
            normals.push([0,-1,0]);
        }

        // Indices for Cylinder Base
        for (let i = vertices.length - pArr, j = vertices.length - 1; i <= j; i++, j--) {
            if (i == vertices.length - pArr && j == vertices.length - 1) {
                let p1 = i; let p2 = i + 1; let p3 = j - 1;
                indices.push(...[p1, p2, p3])
            } else if ( i== j ) {
                let p1 = i - 1; let p2 = i; let p3 = j + 1;
                indices.push(...[p1, p2, p3])
            } else {
                let p11 = j; let p12 = i; let p13 = i + 1;
                let p21 = j; let p22 = i + 1; let p23 = j - 1;
                indices.push(...[p11, p12, p13, p21, p22, p23]);
            }
        }

        // Vertices for Cylinder Top
          for (let i = 0; i <= 360; i += vSplit) {
            let angle = Util.DegreesToRadians(i);
            let x = Number((radius * Math.cos(angle)).toPrecision(2));
            let z = Number((radius * Math.sin(angle)).toPrecision(2));
            let y = (0.0 + 0.5) * 2.0;
            
            vertices.push([x,y,z]);
            normals.push([0, 1, 0]);
        }

        // Indices for Cylinder Top
        for (let i = vertices.length - pArr, j = vertices.length - 1; i <= j; i++, j--) {
            if (i == vertices.length - pArr && j == vertices.length - 1) {
                let p1 = i; let p2 = i + 1; let p3 = j - 1;
                indices.push(...[p3, p2, p1])
            } else if ( i== j ) {
                let p1 = i - 1; let p2 = i; let p3 = j + 1;
                indices.push(...[p3, p2, p1])
            } else {
                let p11 = j; let p12 = i; let p13 = i + 1;
                let p21 = j; let p22 = i + 1; let p23 = j - 1;
                indices.push(...[p13, p12, p11, p23, p22, p21]);
            }
        }

        return {
            vertices,
            indices,
            normals
        }
    }
}