import { SceneManager } from "./SceneManagement";
import { Input } from "./Input";

export class Web3D {
  static init(): boolean {
    const sceneManagerInitialized = SceneManager.init();
    const inputActivated = Input.activateInputSystem();
    return sceneManagerInitialized && inputActivated;
  }

  static clean(): void {
    SceneManager.clean();
    Input.cleanInputSystem();
  }
}
