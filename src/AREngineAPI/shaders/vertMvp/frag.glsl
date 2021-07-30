#version 300 es

precision mediump float;

in vec3 vNormal;
in vec3 fragPos;

out vec4 finalColor;
uniform float u_time;

struct Material {
    vec4 color;
    float ambience;
    float diffuse;
    float specular;
    float shininess;
};

//Directional Light
vec3 light = normalize(vec3( 0 , 0 , 1));
Material material = Material(vec4(1 , 0 , 0 , 1), 0.2 , 0.8, 0.95, 25.);

vec4 getAmbience(Material material) {
    return vec4(material.color.xyz * material.ambience, 1.0);
}

vec4 getDiffuse(Material material, vec3 normal, vec3 light) {
    float diffuseCoeff = dot(normal, light);
    return vec4(material.color.xyz * material.diffuse * diffuseCoeff, 1.0);
}

vec4 getSpecular(Material material, vec3 normal, vec3 light) {

    // Current Camera Post
    vec3 cameraPos = vec3(0 , 3 , -4);

    // Reflect the Light over the normal
    vec3 reflectedLight = reflect(light, normal);
    vec3 viewDir = normalize(cameraPos - fragPos);

    float specCoeff =  pow(max(dot(viewDir, reflectedLight), 0.), material.shininess);

    return vec4(material.color.xyz * material.specular * specCoeff, 1.0);
}

void main() {
    vec3 rLight = reflect(light, vNormal);

    vec4 ambience = getAmbience(material);
    vec4 diffuse = getDiffuse(material, vNormal, -light);
    vec4 specular = getSpecular(material, vNormal, -light);
    
    finalColor = ambience + diffuse + specular;
}