import { Scene, ViewportSize } from "./Scene";

export class SceneManager {

    static scenes: Map<string, Scene>;

    static init(): boolean {
        SceneManager.scenes = new Map<string, Scene>();
        return true;
    }   

    static createScene(name:string, size: ViewportSize, canvas?: HTMLCanvasElement): Scene {
        !SceneManager.scenes && SceneManager.init();

        const scene = new Scene(name, size, canvas);
        SceneManager.scenes.set(name, scene);
        return scene;
    }

    static clean(): void {
        SceneManager.scenes.forEach((scene: Scene) => scene.onDestroy());
    }

}