export enum KeyCode {
    A = 65,
    B = 66,
    C = 67,
    D = 68,
    E = 69,
    F = 70,
    G = 71,
    H = 72,
    I = 73,
    J = 74,
    K = 75,
    L = 76,
    M = 77,
    N = 78,
    O = 79,
    P = 80,
    Q = 81,
    R = 82,
    S = 83,
    T = 84,
    U = 85,
    V = 86,
    W = 87,
    X = 88,
    Y = 89,
    Z = 90
};

export class KeyboardHandler {
    private static keyPressedMap: Map<number, boolean>;

    private static onKeyDown = (event: KeyboardEvent) => {
        KeyboardHandler.keyPressedMap.set(event.key.charCodeAt(0)^32, true);
    }

    private static onKeyUp = (event: KeyboardEvent) => {
        KeyboardHandler.keyPressedMap.set(event.key.charCodeAt(0)^32, false);
    }

    public static get KeyPressedMap(): Map<number, boolean> {
        return KeyboardHandler.keyPressedMap;
    }

    public static activateKeyboardInputSystem() {
        KeyboardHandler.keyPressedMap = new Map<KeyCode, boolean>();

        window.addEventListener('keydown', KeyboardHandler.onKeyDown);
        window.addEventListener('keyup', KeyboardHandler.onKeyUp);
    }

    public static cleanKeyboardInputSystem() {
        window.removeEventListener('keydown', KeyboardHandler.onKeyDown);
        window.removeEventListener('keyup', KeyboardHandler.onKeyUp);
    }
}
