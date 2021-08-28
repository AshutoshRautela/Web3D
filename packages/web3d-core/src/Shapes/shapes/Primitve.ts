import { Mesh } from "../../Mesh";
import { Scene } from "../../SceneManagement";
import { MeshData } from "../../interfaces";
// Loading Obj Models
import MonkeyMesh from "../../MeshFiles/Obj/Monkey.obj";
import { MeshRenderer } from "../../MeshRenderer";
import { CylinderCreator, UVSphereCreator } from "../../GeometryCreator";
import { Model } from "./Model";
import { PhongShadingMaterial } from "../../Materials";
import { Shaders, ShaderType } from "../../Shader";

export enum PrimitiveType {
    Cube,
    Quad,
    Sphere,
    Cylinder,
    Cone,
    Monkey,
}

export  class Primitive extends Model {

    constructor(scene3D: Scene,
         meshRenderer: MeshRenderer,
         private primitiveType: PrimitiveType,
         private shaderType?: Shaders
    ) {
        super(scene3D, meshRenderer);
        this.material = new PhongShadingMaterial(scene3D, this, [], shaderType);
    }

    onRender(deltaTime: number) {
        super.onRender(deltaTime);
    }

    onDestroy() {
        super.onDestroy();
    }

    static createPrimitive(scene3D: Scene, primitiveType: PrimitiveType, shaderType: Shaders): Primitive {
        let primitive: Primitive;
        if (primitiveType == PrimitiveType.Quad) {
            const mesh = new Mesh(require('../../MeshFiles/Json/QuadMesh.json'));
            primitive = new Primitive(
                scene3D,
                new MeshRenderer(scene3D.WebGLContext, mesh),
                primitiveType,
                shaderType || Shaders.StandardPhong
            );
        }
        else if (primitiveType == PrimitiveType.Cube) {
            const mesh = new Mesh(require('../../MeshFiles/Json/CubeMesh.json'));
            primitive = new Primitive(
                scene3D,
                new MeshRenderer(scene3D.WebGLContext, mesh),
                primitiveType,
                shaderType || Shaders.StandardPhong
            );
        }
        else if (primitiveType == PrimitiveType.Sphere) {
            const meshData = UVSphereCreator.createGeometry(1, 5);
            const mesh = new Mesh(meshData);
            primitive = new Primitive(
                scene3D,
                new MeshRenderer(scene3D.WebGLContext, mesh),
                primitiveType,
                shaderType || Shaders.StandardPhong
            );
        }
        else if (primitiveType == PrimitiveType.Cone) {
            const mesh = new Mesh(require('../../MeshFiles/Json/ConeMesh.json'));
            primitive = new Primitive(
                scene3D,
                new MeshRenderer(scene3D.WebGLContext, mesh),
                primitiveType,
                shaderType || Shaders.StandardPhong
            );
        }
        else if (primitiveType == PrimitiveType.Cylinder) {
            const meshData = CylinderCreator.createGeometry();
            const mesh = new Mesh(meshData);
            primitive = new Primitive(
                scene3D,
                new MeshRenderer(scene3D.WebGLContext, mesh),
                primitiveType,
                shaderType || Shaders.StandardPhong
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
                primitiveType,
                shaderType || Shaders.StandardPhong
            );
        }
        return primitive;
    }
}