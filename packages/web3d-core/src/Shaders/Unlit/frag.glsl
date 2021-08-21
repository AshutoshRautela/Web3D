#version 300 es
precision mediump float;

in vec3 fragPos;
in vec2 texCord;

uniform float u_time;

out vec4 finalColor;

struct Texture {
    sampler2D tsampler;
    int tsampler_check;
};

uniform Texture u_texture;

void main() {
    finalColor = texture(u_texture.tsampler, texCord);    
}