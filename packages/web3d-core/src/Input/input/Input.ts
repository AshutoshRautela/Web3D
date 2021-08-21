import { KeyboardHandler, KeyCode } from "./KeyboardHandler";
import { MouseButton, MouseDetails, MouseHandler, MouseWheelDetails } from "./MouseHandler";
export {
    MouseButton,
    MouseDetails,
    KeyCode
};

export class Input {
    public static activateInputSystem(): boolean {
        
        KeyboardHandler.activateKeyboardInputSystem();
        MouseHandler.activateMouseInputSystem();
       
        window.oncontextmenu = () => false;
        return true;
    }

    public static cleanInputSystem() {
        
        KeyboardHandler.cleanKeyboardInputSystem();
        MouseHandler.cleanMouseInputSystem();
    }

    public static IsKeyPressed(keyCode: KeyCode): boolean {
        return KeyboardHandler.KeyPressedMap.get(keyCode);
    }


    // Mouse Events
    public static IsMouseDown(button: MouseButton): MouseDetails {
        return MouseHandler.IsMouseDownMap.get(button);
    }

    public static OnMouseWheel(): MouseWheelDetails {
        return MouseHandler.OnMouseWheel();
    }
}