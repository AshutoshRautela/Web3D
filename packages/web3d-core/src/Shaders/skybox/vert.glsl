#version 300 es

layout(location = 0) in vec3 a_position;

uniform mat4 u_model;
uniform mat4 u_projection;
uniform mat4 u_view;

out vec3 fragPos;

void main() {
    fragPos = a_position;
    mat4 view = mat4(mat3(u_view));
    vec4 pos = u_projection * view * vec4(a_position, 1.0);
    gl_Position = pos.xyww;
}