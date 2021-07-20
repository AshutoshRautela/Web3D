#version 300 es

in vec3 a_position;

uniform mat4 u_mvp;

void main() {
    vec4 mvp_position = u_mvp * vec4(a_position, 1.0);
    gl_Position = mvp_position;
}