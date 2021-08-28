#version 300 es

precision mediump float;

in vec3 vNormal;
in vec3 fragPos;

uniform vec3 u_cameraPos;
uniform samplerCube skybox;

out vec4 outColor;

void main() {
    float ratio = 1.00/ 1.52;
    vec3 viewDir = normalize(fragPos - u_cameraPos);
    //vec3 refDir = reflect(viewDir, normalize(vNormal));
    vec3 refDir = refract(viewDir, normalize(vNormal), ratio);
    vec4 fragColor = vec4(texture(skybox, refDir).rgb, 1.0);

    outColor = fragColor;
}