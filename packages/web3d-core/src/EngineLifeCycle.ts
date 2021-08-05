export interface EngineLifecycle {
    onInit?: () => void;
    onRender?: (deltaTime: number) => void;
    onDestroy?: () => void;
}