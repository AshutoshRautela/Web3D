import { mat4 } from "gl-matrix";
import { DirectionalLight, PointLight } from "../../Lights";
import { PhoneShadingMaterial } from "../../Materials";
import { Mesh } from "../../Mesh";
import { Scene } from "../../Scene";
import { SceneObject } from "../../SceneObject";
import { Shader } from "../../Shader";
import { Transform } from "../../Transform";
import { MeshData } from "../../interfaces";

// Loading Obj Models
import CubeMesh from "../../MeshFiles/Obj/Cube.obj";
import MonkeyMesh from "../../MeshFiles/Obj/Monkey.obj";

export enum PrimitiveType {
    Cube,
    Quad,
    Sphere,
    Cylinder,
    Cone,
    Monkey
}

export  class Primitive extends SceneObject {

    private timeUniformLocation!: WebGLUniformLocation | null;
    private mvpUniformLocation!: WebGLUniformLocation | null;
    private modelUniformLocation: WebGLUniformLocation | null;
    
    private uniformDLightsCount: WebGLUniformLocation;
    private uniformDLightsColor: WebGLUniformLocation[] = [];
    private uniformDLightsDirection: WebGLUniformLocation[] = [];
    private uniformDLightsIntensity: WebGLUniformLocation[] = [];

    private uniformPLightsCount: WebGLUniformLocation;
    private uniformPLightsColor: WebGLUniformLocation[] = [];
    private uniformPLightsPosition: WebGLUniformLocation[] = [];
    private uniformPLightsIntensity: WebGLUniformLocation[] = [];
    private uniformPLightsAttenC: WebGLUniformLocation[] = [];

    constructor(scene3D: Scene, private mesh: Mesh, private shader: Shader, private primitiveType: PrimitiveType) {
        super(scene3D);

        this.transform = new Transform();
        if (!this.shader.ShaderProgram) {
            throw new Error('Error Compiling Shader');
        }
        this.mesh.onInit();
        this.initUniforms();
        this.material = new PhoneShadingMaterial(this.gl2, this.shader.ShaderProgram);
    }

    private initUniforms() {
        this.timeUniformLocation = this.gl2.getUniformLocation(this.shader.ShaderProgram, 'u_time');
        this.mvpUniformLocation = this.gl2.getUniformLocation(this.shader.ShaderProgram, 'u_mvp');
        this.modelUniformLocation = this.gl2.getUniformLocation(this.shader.ShaderProgram, 'u_model');
        
        this.uniformDLightsCount = this.gl2.getUniformLocation(this.shader.ShaderProgram, 'u_dLights.numLights');
        this.scene3D.DirectionalLights.forEach((dLight: DirectionalLight, index: number) => {
            this.uniformDLightsColor.push(this.gl2.getUniformLocation(this.shader.ShaderProgram, `u_dLights.lights[${index}].color`));
            this.uniformDLightsDirection.push(this.gl2.getUniformLocation(this.shader.ShaderProgram, `u_dLights.lights[${index}].direction`));
            this.uniformDLightsIntensity.push(this.gl2.getUniformLocation(this.shader.ShaderProgram, `u_dLights.lights[${index}].intensity`));
        });

        this.uniformPLightsCount = this.gl2.getUniformLocation(this.shader.ShaderProgram, 'u_pLights.numLights');
        this.scene3D.PointLights.forEach((pLight: PointLight, index: number) => {
            this.uniformPLightsColor.push(this.gl2.getUniformLocation(this.shader.ShaderProgram, `u_pLights.lights[${index}].color`));
            this.uniformPLightsPosition.push(this.gl2.getUniformLocation(this.shader.ShaderProgram, `u_pLights.lights[${index}].position`));
            this.uniformPLightsIntensity.push(this.gl2.getUniformLocation(this.shader.ShaderProgram, `u_pLights.lights[${index}].intensity`));
            this.uniformPLightsAttenC.push(this.gl2.getUniformLocation(this.shader.ShaderProgram, `u_pLights.lights[${index}].attenuationCoeff`));
        });       
    }

    onRender(deltaTime: number) {
        if (this.shader.ShaderProgram) {
            this.transform.onRender();

            let mvMatrix: mat4 =  mat4.create();
            mvMatrix = mat4.multiply(mvMatrix, this.scene3D.RenderCamera.ProjectionMatrix, this.scene3D.RenderCamera.ViewMatrix);
            mvMatrix = mat4.multiply(mvMatrix, mvMatrix, this.transform.ModelMatrix);

            this.gl2.useProgram(this.shader.ShaderProgram);

            this.gl2.uniform1f(this.timeUniformLocation, performance.now() / 500);
            this.gl2.uniformMatrix4fv(this.mvpUniformLocation, false, mvMatrix);
            this.gl2.uniformMatrix4fv(this.modelUniformLocation, false, this.transform.ModelMatrix);
            
            if (this.scene3D.PointLights.length > 0) {
                this.gl2.uniform1i(this.uniformPLightsCount, this.scene3D.PointLights.length );
                this.scene3D.PointLights.forEach((pointLight: PointLight, index: number) => {
                    this.gl2.uniform3fv(this.uniformPLightsColor[index], pointLight.Color);
                    this.gl2.uniform3fv(this.uniformPLightsPosition[index], pointLight.Position);
                    this.gl2.uniform1f(this.uniformPLightsIntensity[index], pointLight.Intensity);
                    this.gl2.uniform3fv(this.uniformPLightsAttenC[index], pointLight.AttenuationCoeff);
                });
            };
            if (this.scene3D.DirectionalLights.length > 0) {
                this.gl2.uniform1i(this.uniformDLightsCount, this.scene3D.DirectionalLights.length );
                this.scene3D.DirectionalLights.forEach((directionLight: DirectionalLight, index: number) => {
                    this.gl2.uniform3fv(this.uniformDLightsColor[index], directionLight.Color);
                    this.gl2.uniform3fv(this.uniformDLightsDirection[index], directionLight.Direction);
                    this.gl2.uniform1f(this.uniformDLightsIntensity[index], directionLight.Intensity);
                });
            }
            this.material.onUpdate();
            this.mesh.draw();
        }
    }

    onDestroy() {
        this.mesh.onDestroy();
        this.shader.onDestroy();
    }

    static createPrimitive(scene3D: Scene, primitiveType: PrimitiveType): Primitive {
        let primitive: Primitive;
        const shader = new Shader(scene3D.WebGLContext,
            require('../../shaders/vertMvp/vert.glsl'),
            require('../../shaders/vertMvp/frag.glsl')
        );
        if (primitiveType == PrimitiveType.Quad) {
            const mesh = new Mesh(
                scene3D, 
                shader.ShaderProgram,
                require('../../MeshFiles/Json/QuadMesh.json')
            );
            primitive = new Primitive(
                scene3D,
                mesh,
                shader,
                primitiveType
            );
        }
        else if (primitiveType == PrimitiveType.Cube) {
            const myVertices = CubeMesh.sorted.vertices as Array<Array<string>>;
            const myNormals = CubeMesh.sorted.normals as Array<Array<string>>;
            const myIndices = CubeMesh.sorted.indices  as Array<string>;

            const vertices = myVertices.map(vertex => vertex.map(e => Number(e)));
            const normals = myNormals.map(normal => normal.map(e => Number(e)));
            const indices = myIndices.map(index => Number(index));

            const meshData: MeshData = {
                vertices,
                normals,
                indices
            };

            const mesh = new Mesh(
                scene3D, 
                shader.ShaderProgram,
                meshData
            );
            primitive = new Primitive(
                scene3D,
                mesh,
                shader,
                primitiveType
            );
        }
        else if (primitiveType == PrimitiveType.Sphere) {
            const mesh = new Mesh(
                scene3D, 
                shader.ShaderProgram,
                require('../../MeshFiles/Json/UVSphereMesh.json')
            );
            primitive = new Primitive(
                scene3D,
                mesh,
                shader,
                primitiveType
            );
        }
        else if (primitiveType == PrimitiveType.Cone) {
            const mesh = new Mesh(
                scene3D, 
                shader.ShaderProgram,
                require('../../MeshFiles/Json/ConeMesh.json')
            );
            primitive = new Primitive(
                scene3D,
                mesh,
                shader,
                primitiveType
            );
        }
        else if (primitiveType == PrimitiveType.Cylinder) {
            const mesh = new Mesh(
                scene3D, 
                shader.ShaderProgram,
                require('../../MeshFiles/Json/CylinderMesh.json')
            );
            primitive = new Primitive(
                scene3D,
                mesh,
                shader,
                primitiveType
            );
        }
        else if (primitiveType == PrimitiveType.Monkey) {
            const myVertices = MonkeyMesh.sorted.vertices as Array<Array<string>>;
            const myNormals = MonkeyMesh.sorted.normals as Array<Array<string>>;
            const myIndices = MonkeyMesh.sorted.indices  as Array<string>;

            const vertices = myVertices.map(vertex => vertex.map(e => Number(e)));
            const normals = myNormals.map(normal => normal.map(e => Number(e)));
            const indices = myIndices.map(index => Number(index));

            const meshData: MeshData = {
                vertices,
                normals,
                indices
            };

            const mesh = new Mesh(
                scene3D, 
                shader.ShaderProgram,
                meshData
            );
            primitive = new Primitive(
                scene3D,
                mesh,
                shader,
                primitiveType
            );
        }
        return primitive;
    }
}