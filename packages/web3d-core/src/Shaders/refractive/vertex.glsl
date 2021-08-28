#version 300 es

layout(location = 0) in vec3 a_position;
layout(location = 1) in vec3 a_normal;

uniform mat4 u_mvp;
uniform mat4 u_model;

out vec3 vNormal;
out vec3 fragPos;

void main() {
    vNormal = normalize(mat3(inverse(transpose(u_model))) * a_normal);
    fragPos = vec3(u_model * vec4(a_position, 1.0));
    gl_Position = u_mvp * vec4(a_position, 1.0);
}