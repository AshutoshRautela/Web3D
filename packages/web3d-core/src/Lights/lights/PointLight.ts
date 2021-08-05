import { vec3, vec4 } from 'gl-matrix';
import { Transform } from '../../Transform'
import { Light } from './Light';

export class PointLight extends Light {

    private transform: Transform;
    private range: number = 10;

    // Attenuation Coeffs
    private attenuationCoeff: vec3;


    constructor() {
        super();
        this.transform = new Transform();
        this.range = 10;

        this.attenuationCoeff = vec3.fromValues(1.0 , 0.045, 0.0075);
    }

    /**
     * Point Light transform
     */
    public get Transform() {
        return this.transform;
    }

    /**
     * Set Point Light source color
     * @param lightColor Point Light color in vec3
     * @returns 
     */
    public setColor(lightColor: vec3) {
        vec3.set(this.color, lightColor[0], lightColor[1], lightColor[2]);
        return this;
    }

    /**
     * Set Point Light source intensity
     * @param intensity Point Light intensity in number
     * @returns 
     */
    public setIntensity(intensity: number) {
        this.intensity = intensity;
        return this;
    }

    /**
     * Set Point Light source position
     * @param position Point Light position in vec3
     * @returns 
     */
    public setPosition(position: vec3) {
        vec3.set(this.transform.position, position[0], position[1], position[2]);
        return this;
    }

    /**
     * Set Point Light source range
     * @param range Point Light range in number
     * @returns 
     */
    public setRange(range: number) {
        this.range = range;
        return this;
    }

    /**
     * Point Light Color
     */
    public get Color(): vec3 {
        return this.color;
    }

    /**
     * Point Light World Position
     */
    public get Position(): vec3 {
        return this.transform.position;
    }

    /**
     * Point Light range
     */
    public get Range(): number {
        return this.range;
    }

    /**
     * Point Light Intensity
     */
    public get Intensity(): number {
        return this.intensity;
    }

    /**
     * Point Light Attenuation
     */
    public get AttenuationCoeff(): vec3 {
        return this.attenuationCoeff;
    }
}