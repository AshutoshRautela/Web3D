#version 300 es

layout(location = 0) in vec3 a_position;
layout(location = 1) in vec3 a_normal;
layout(location = 2) in vec2 a_texCord;

uniform mat4 u_model;
uniform mat4 u_mvp;

uniform vec2 u_tiling;

out vec3 fragPos;
out vec3 vNormal;
out vec2 texCord;

void main() {
    vNormal = normalize(mat3(inverse(transpose(u_model))) * a_normal);
    texCord = a_texCord * u_tiling;

    fragPos = vec3(u_model * vec4(a_position, 1.0));

    vec4 mvp_position = u_mvp * vec4(a_position, 1.0);
    gl_Position = mvp_position;
}