#version 300 es

precision mediump float;

out vec4 finalColor;
uniform float u_time;

float fMultiplier = 1.0;
float aMultiplier = 2.0;

void main() {
    float x = abs(sin(u_time * fMultiplier) * aMultiplier);
    float y = abs(cos(u_time * fMultiplier) * aMultiplier);
    float z = abs(sin(u_time * fMultiplier) * aMultiplier);

    finalColor = vec4(x, y, z, 1.0);
}