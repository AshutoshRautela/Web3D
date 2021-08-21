import { EngineLifecycle } from "../EngineLifeCycle";
import { Util } from "../Util";

export class Texture2D implements EngineLifecycle {

    private image: HTMLImageElement;
    private texture: WebGLTexture;

    constructor(private gl2: WebGL2RenderingContext, private path?: string) {
    }

    onInit() {
        this.texture = this.gl2.createTexture();
        
        // Updating a sample texture
        this.gl2.bindTexture(this.gl2.TEXTURE_2D, this.texture);
        this.gl2.texImage2D(this.gl2.TEXTURE_2D, 0, this.gl2.RGBA, 1, 1, 0, this.gl2.RGBA, this.gl2.UNSIGNED_BYTE, new Uint8Array([255, 255 , 255 , 255]));
        this.path && this.setImage();
    }

    setImage() {
        this.image = new Image();
        this.image.onload = () => {
            this.gl2.bindTexture(this.gl2.TEXTURE_2D, this.texture);
            this.gl2.texImage2D(this.gl2.TEXTURE_2D, 0, this.gl2.RGBA, this.gl2.RGBA, this.gl2.UNSIGNED_BYTE, this.image);
            if (Util.IsPowerOf2(this.image.width) && Util.IsPowerOf2(this.image.height)) {
                this.gl2.generateMipmap(this.gl2.TEXTURE_2D);
                this.gl2.texParameteri(this.gl2.TEXTURE_2D, this.gl2.TEXTURE_MIN_FILTER, this.gl2.LINEAR_MIPMAP_LINEAR);
                this.gl2.texParameteri(this.gl2.TEXTURE_2D, this.gl2.TEXTURE_WRAP_S, this.gl2.REPEAT);
                this.gl2.texParameteri(this.gl2.TEXTURE_2D, this.gl2.TEXTURE_WRAP_T, this.gl2.REPEAT);
            } else {
                this.gl2.texParameteri(this.gl2.TEXTURE_2D, this.gl2.TEXTURE_WRAP_S, this.gl2.REPEAT);
                this.gl2.texParameteri(this.gl2.TEXTURE_2D, this.gl2.TEXTURE_WRAP_T, this.gl2.REPEAT);
                this.gl2.texParameteri(this.gl2.TEXTURE_2D, this.gl2.TEXTURE_MIN_FILTER, this.gl2.LINEAR);
                this.gl2.texParameteri(this.gl2.TEXTURE_2D, this.gl2.TEXTURE_MAG_FILTER, this.gl2.LINEAR);
            }
        }
        this.image.src = this.path;     
    }

    bind(index: number): void {
        this.gl2.activeTexture(this.gl2.TEXTURE0 + index);
        this.gl2.bindTexture(this.gl2.TEXTURE_2D, this.texture);
    }

    unbind() {
        
    }

    onDestroy() {
        this.gl2.deleteTexture(this.texture);
    }
}