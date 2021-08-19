import { EngineLifecycle } from "../EngineLifeCycle";
import { Util } from "../Util";

export class Texture2D implements EngineLifecycle {

    private image: HTMLImageElement;
    private texture: WebGLTexture;

    private imgLoaded: boolean = false;

    constructor(private gl2: WebGL2RenderingContext, private path: string) {
    }

    onInit() {
        this.texture = this.gl2.createTexture();

        // Updating a sample texture
        this.gl2.bindTexture(this.gl2.TEXTURE_2D, this.texture);
        this.gl2.texImage2D(this.gl2.TEXTURE_2D, 0, this.gl2.RGBA, 1, 1, 0, this.gl2.RGBA, this.gl2.UNSIGNED_BYTE, new Uint8Array([255, 0 , 255 , 255]));

        this.image = new Image();
        this.image.onload = () => {
            this.gl2.bindTexture(this.gl2.TEXTURE_2D, this.texture);
            // this.gl2.texImage2D(this.gl2.TEXTURE_2D, 0, this.gl2.RGBA8UI, this.image.width, this.image.height, 0, this.gl2.RGBA_INTEGER, this.gl2.UNSIGNED_BYTE, this.image);
            this.gl2.texImage2D(this.gl2.TEXTURE_2D, 0, this.gl2.RGBA, this.gl2.RGBA, this.gl2.UNSIGNED_BYTE, this.image);
            if (Util.IsPowerOf2(this.image.width) && Util.IsPowerOf2(this.image.height)) {
                this.gl2.generateMipmap(this.gl2.TEXTURE_2D);
                this.gl2.texParameteri(this.gl2.TEXTURE_2D, this.gl2.TEXTURE_MIN_FILTER, this.gl2.LINEAR_MIPMAP_LINEAR);
            } else {
                this.gl2.texParameteri(this.gl2.TEXTURE_2D, this.gl2.TEXTURE_WRAP_S, this.gl2.CLAMP_TO_EDGE);
                this.gl2.texParameteri(this.gl2.TEXTURE_2D, this.gl2.TEXTURE_WRAP_T, this.gl2.CLAMP_TO_EDGE);
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
        if (this.imgLoaded) {
            this.gl2.activeTexture(null);
            this.gl2.bindTexture(this.gl2.TEXTURE_2D, null);
        }
    }

    onDestroy() {
        this.gl2.deleteTexture(this.texture);
    }
}