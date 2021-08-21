export class Time {

    private static c_time: number = 0;

    static update(): void {
        Time.c_time = performance.now() / 1000;
    }

    static get time(): number {
        return Time.c_time;
    }
}