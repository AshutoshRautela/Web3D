#version 300 es

in vec3 a_position;

uniform float uPointSize;

void main() {
    gl_PointSize = abs(sin(uPointSize) * 50.0);
    gl_Position = vec4(a_position, 1.0);
}