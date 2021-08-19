export class Util {
    static DegreesToRadians(degrees: number): number {
        return degrees * Math.PI / 180;
    }

    static IsPowerOf2(value: number): boolean {
        return (value & (value - 1)) === 0;
    }
}