#version 300 es

precision mediump float;

in vec3 fragPos;

out vec4 finalColor;

uniform samplerCube skybox;

void main() {
    finalColor = texture(skybox, fragPos);
}