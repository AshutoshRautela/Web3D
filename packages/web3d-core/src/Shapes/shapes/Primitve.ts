import { Mesh } from "../../Mesh";
import { Scene } from "../../Scene";
import { MeshData } from "../../interfaces";
// Loading Obj Models
import MonkeyMesh from "../../MeshFiles/Obj/Monkey.obj";
import { MeshRenderer } from "../../MeshRenderer";
import { Texture2D } from "../../Texture2D/Texture2D";
import { Model } from "./Model";

export enum PrimitiveType {
    Cube,
    Quad,
    Sphere,
    Cylinder,
    Cone,
    Monkey
}

export  class Primitive extends Model {

    constructor(scene3D: Scene,
         meshRenderer: MeshRenderer,
         private primitiveType: PrimitiveType
    ) {
        super(scene3D, meshRenderer);
        if (primitiveType === PrimitiveType.Cube) {
            this.material.setTexture(new Texture2D(this.gl2, '/textures/BrickWall2.jpeg'));
        }
    }

    onRender(deltaTime: number) {
        super.onRender(deltaTime);
    }

    onDestroy() {
        super.onDestroy();
    }

    static createPrimitive(scene3D: Scene, primitiveType: PrimitiveType): Primitive {
        let primitive: Primitive;
        if (primitiveType == PrimitiveType.Quad) {
            const mesh = new Mesh(require('../../MeshFiles/Json/QuadMesh.json'));
            primitive = new Primitive(
                scene3D,
                new MeshRenderer(scene3D.WebGLContext, mesh),
                primitiveType
            );
        }
        else if (primitiveType == PrimitiveType.Cube) {
            const mesh = new Mesh(require('../../MeshFiles/Json/CubeMesh.json'));
            primitive = new Primitive(
                scene3D,
                new MeshRenderer(scene3D.WebGLContext, mesh),
                primitiveType
            );
        }
        else if (primitiveType == PrimitiveType.Sphere) {
            const mesh = new Mesh(require('../../MeshFiles/Json/UVSphereMesh.json'));
            primitive = new Primitive(
                scene3D,
                new MeshRenderer(scene3D.WebGLContext, mesh),
                primitiveType
            );
        }
        else if (primitiveType == PrimitiveType.Cone) {
            const mesh = new Mesh(require('../../MeshFiles/Json/ConeMesh.json'));
            primitive = new Primitive(
                scene3D,
                new MeshRenderer(scene3D.WebGLContext, mesh),
                primitiveType
            );
        }
        else if (primitiveType == PrimitiveType.Cylinder) {
            const mesh = new Mesh(require('../../MeshFiles/Json/CylinderMesh.json'));
            primitive = new Primitive(
                scene3D,
                new MeshRenderer(scene3D.WebGLContext, mesh),
                primitiveType
            );
        }
        else if (primitiveType == PrimitiveType.Monkey) {
            const { vertices, normals, indices } = MonkeyMesh.meshdata;
            const meshData: MeshData = {
                vertices,
                normals,
                indices
            };
            const mesh = new Mesh(MonkeyMesh.meshdata);
            primitive = new Primitive(
                scene3D,
                new MeshRenderer(scene3D.WebGLContext, mesh),
                primitiveType
            );
        }
        return primitive;
    }
}