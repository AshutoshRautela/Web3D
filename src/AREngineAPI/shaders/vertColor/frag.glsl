#version 300 es

precision mediump float;

in vec4 fragColor;
out vec4 finalColor;

void main() {
    finalColor = fragColor;
}