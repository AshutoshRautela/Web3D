#version 300 es

precision mediump float;

in vec3 vNormal;
in vec3 fragPos;

uniform vec3 u_cameraPos;
uniform samplerCube skybox;

out vec4 outColor;

void main() {
    vec3 viewDir = normalize(u_cameraPos - fragPos);
    vec3 refDir = reflect(viewDir, normalize(vNormal));
    vec4 fragColor = vec4(1.0f, 0.0f, 0.0f, 1.0f);
    fragColor = vec4(texture(skybox, refDir).rgb, 1.0);

    outColor = fragColor;
}