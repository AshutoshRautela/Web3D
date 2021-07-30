#version 300 es

precision mediump float;

in vec3 vNormal;

out vec4 finalColor;
uniform float u_time;

void main() {
    //Directional Light
    vec3 light = normalize(vec3( 0 , 0 , 1));

    float diffuse = dot(vNormal, -light);

    vec3 col = vec3(1.0) * diffuse;
    finalColor = vec4(col, 1.0);
    // finalColor = vec4(vec3(1), 1.0);
}