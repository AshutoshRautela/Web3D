#version 300 es

in vec3 a_position;
in vec4 a_color;

out vec4 fragColor;

uniform float uPointSize;

void main() {
    fragColor = a_color;

    gl_PointSize = abs(sin(uPointSize)) * 50.0;
    gl_Position = vec4(a_position, 1.0);
}