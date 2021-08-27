import { EngineLifecycle } from '../../EngineLifeCycle';

export class CubemapTexture implements EngineLifecycle {
    
    private cubemapTexture: WebGLTexture;
    private imagePaths: string[];

    constructor(private gl2: WebGL2RenderingContext, rightFace: string, leftFace: string, topFace: string, bottomFace: string, frontFace: string, backFace: string) {
        this.imagePaths = [rightFace, leftFace, topFace, bottomFace, frontFace, backFace];

        this.cubemapTexture = this.gl2.createTexture(); 
        this.uploadTextureData_Raw();
        this.uploadTextureData();
    }

    private uploadTextureData_Raw() {
        for (let i = 0; i < this.imagePaths.length; i++) {
            this.gl2.bindTexture(this.gl2.TEXTURE_CUBE_MAP, this.cubemapTexture);
            this.gl2.texImage2D(this.gl2.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.gl2.RGBA, 1, 1, 0, this.gl2.RGBA, this.gl2.UNSIGNED_BYTE, new Uint8Array([255, 255 , 255 , 255]));
        }
    }

    private uploadImage(imagePath: string): Promise<HTMLImageElement>{
        return new Promise((resolve , reject) => {
            const img = new Image();
            img.src = imagePath;
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(err);
        });
    }

    private async uploadTextureData(): Promise<void> {
        const imgElements = [];
        for (let i = 0; i < this.imagePaths.length; i++) {
            const img = await this.uploadImage(this.imagePaths[i]);
            imgElements.push(img);
        }
        for (let i = 0; i < imgElements.length; i++) {
            this.gl2.texImage2D(this.gl2.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.gl2.RGBA, this.gl2.RGBA, this.gl2.UNSIGNED_BYTE, imgElements[i]);
            this.gl2.texParameteri(this.gl2.TEXTURE_CUBE_MAP, this.gl2.TEXTURE_MAG_FILTER, this.gl2.LINEAR);
            this.gl2.texParameteri(this.gl2.TEXTURE_CUBE_MAP, this.gl2.TEXTURE_MIN_FILTER, this.gl2.LINEAR);
            this.gl2.texParameteri(this.gl2.TEXTURE_CUBE_MAP, this.gl2.TEXTURE_WRAP_S, this.gl2.CLAMP_TO_EDGE);
            this.gl2.texParameteri(this.gl2.TEXTURE_CUBE_MAP, this.gl2.TEXTURE_WRAP_T, this.gl2.CLAMP_TO_EDGE);
            this.gl2.texParameteri(this.gl2.TEXTURE_CUBE_MAP, this.gl2.TEXTURE_WRAP_R, this.gl2.CLAMP_TO_EDGE);
        }
        await setTimeout(() => {}, 100);
    }

    public bind() {
        this.gl2.bindTexture(this.gl2.TEXTURE_CUBE_MAP, this.cubemapTexture);
    }

    public unbind() {
        
    }

    onDestroy() {
        this.gl2.deleteTexture(this.cubemapTexture);
    }
}