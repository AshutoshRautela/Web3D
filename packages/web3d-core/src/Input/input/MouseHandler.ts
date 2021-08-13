import { vec2 } from "gl-matrix";

export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2
};

export interface MouseDetails {
    isDown: boolean;
    pos?: vec2;
    delta?: vec2;
}

export interface MouseWheelDetails {
    isWheeling: boolean;
    wheelValue: number;
}

export class MouseHandler {

    private static isMouseDownMap: Map<MouseButton, MouseDetails>;
    private static wheelValue: number = 0;

    private static onMouseDown = (event: MouseEvent) => {
        MouseHandler.isMouseDownMap.set(event.button, { isDown: true, pos: vec2.fromValues(event.clientX, event.clientY), delta: vec2.create() } );
        return false;
    }

    private static onMouseUp = (event: MouseEvent) => {
        MouseHandler.isMouseDownMap.set(event.button, { isDown: false, pos: vec2.fromValues(event.clientX, event.clientY), delta: vec2.create()} );
        return false;
    }

    private static onMouseMove = (event: MouseEvent) => {
        for (let i = 0; i <= 2; i++) {
            if (MouseHandler.isMouseDownMap.get(i)?.isDown) {
                MouseHandler.isMouseDownMap.set(i, Object.assign({}, MouseHandler.isMouseDownMap.get(i), { 
                    pos: vec2.fromValues(event.clientX, event.clientY),
                    delta: vec2.fromValues(event.movementX, event.movementY) 
                }));
            }
        }
    }

    private static onMouseOut = () => {
        for (let i = 0; i <= 2; i++) {
            if (MouseHandler.isMouseDownMap.get(i)?.isDown) {
                MouseHandler.isMouseDownMap.set(i, Object.assign({}, MouseHandler.isMouseDownMap.get(i), { 
                    delta: vec2.create()
                }));
            }
        }
    }

    private static onMouseWheel = (event: WheelEvent) => {
        MouseHandler.wheelValue = event.deltaY;

        // Clearing up wheel value in the next frame
        requestAnimationFrame(() => MouseHandler.wheelValue = 0 );
    }

    public static activateMouseInputSystem() {
        MouseHandler.isMouseDownMap = new Map<MouseButton, MouseDetails>();
        window.addEventListener('mousedown', MouseHandler.onMouseDown);
        window.addEventListener('mouseup', MouseHandler.onMouseUp);
        window.addEventListener('mousemove', MouseHandler.onMouseMove);
        window.addEventListener('mouseout', MouseHandler.onMouseOut);
        window.addEventListener('mousewheel', MouseHandler.onMouseWheel)
    }

    public static cleanMouseInputSystem() {
        window.removeEventListener('mousedown', MouseHandler.onMouseDown);
        window.removeEventListener('mouseup', MouseHandler.onMouseUp);
        window.removeEventListener('mousemove', MouseHandler.onMouseMove);
        window.addEventListener('mouseout', MouseHandler.onMouseOut);
    }

    public static IsMouseDown(button: MouseButton): MouseDetails {
        return MouseHandler.isMouseDownMap.get(button);
    }

    public static OnMouseWheel(): MouseWheelDetails {
        return {
            isWheeling: MouseHandler.wheelValue != 0,
            wheelValue: MouseHandler.wheelValue
        }
    }

    public static get IsMouseDownMap(): Map<MouseButton, MouseDetails> {
        return MouseHandler.isMouseDownMap;
    }
}

