import { MeshData } from "../../Interfaces";
import { CubemapMaterial } from "../../Materials/materials/CubemapMaterial";
import { Mesh } from "../../Mesh";
import { MeshRenderer } from "../../MeshRenderer";
import { Scene } from "../../SceneManagement";
import { Shaders } from "../../Shader";
import { CubemapTexture } from "../../Textures";
import { Model } from "./Model";

export class Cubemap extends Model {

  constructor(scene3D: Scene, meshRenderer: MeshRenderer, private cubemapTexture: CubemapTexture) {
    super(scene3D, meshRenderer);
    this.material = new CubemapMaterial(scene3D, this, this.cubemapTexture);
  }

  static createCubemap(scene3D: Scene, cubemapTexture: CubemapTexture): Cubemap {
    const meshData: MeshData = require("../../MeshFiles/Json/Skybox.json");
    meshData.indices = meshData.indices.reverse();
    const meshRenderer = new MeshRenderer(
      scene3D.WebGLContext,
      new Mesh(meshData)
    );
    const cubemap = new Cubemap(scene3D, meshRenderer, cubemapTexture);

    return cubemap;
  }
}
