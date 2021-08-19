#version 300 es
precision mediump float;

#define MAX_LIGHTS 50
// Need to find solution for this
#define NUM_LIGHTS 1
#define NUM_LIGHTS_DIRECTIONAL 1

in vec3 vNormal;
in vec3 fragPos;
in vec2 texCord;

uniform float u_time;

out vec4 finalColor;

struct Material {
    vec4 color;
    float ambience;
    float diffuse;
    float specular;
    float shininess;
};
uniform Material u_material;

struct Texture {
    sampler2D tsampler;
    int tsampler_check;
};

uniform Texture u_texture;

struct DirectionalLight {
    vec3 color;
    vec3 direction;
    float intensity;
};
struct DirectionalLights {
    DirectionalLight lights[MAX_LIGHTS];
    int numLights;
};
uniform DirectionalLights u_dLights;

struct PointLight {
    vec3 color;
    vec3 position;
    float intensity;

    vec3 attenuationCoeff;
};
struct PointLights {
    PointLight lights[MAX_LIGHTS];
    int numLights;
};
uniform PointLights u_pLights;
float lightRange = 50.;

vec3 getAmbience(Material material) {
    return material.color.xyz * material.ambience;
}

vec3 getDiffuse(Material material, vec3 normal, vec3 light) {
    float diffuseCoeff = max(0., dot(normal, light));
    return material.color.xyz * material.diffuse * diffuseCoeff;
}

vec3 getSpecular(Material material, vec3 normal, vec3 light) {

    // Current Camera Post
    vec3 cameraPos = vec3(0 , 3 , -4);

    // Reflect the Light over the normal
    vec3 reflectedLight = reflect(-light, normal);
    vec3 viewDir = normalize(cameraPos - fragPos);

    float specCoeff =  pow(max(dot(viewDir, reflectedLight), 0.), material.shininess);

    return material.color.xyz * material.specular * specCoeff;
}

vec3 getPointLightCast(PointLight pointLight) {
    float lightDistance = distance(pointLight.position , fragPos);
    vec3 lightDir = normalize(pointLight.position - fragPos);
    float intensity = 1.2;

    float atten = 1.0 / (pointLight.attenuationCoeff.x + (pointLight.attenuationCoeff.y * lightDistance) + (pointLight.attenuationCoeff.z * pow(lightDistance, 2.)));

    vec3 ambience = getAmbience(u_material) * pointLight.color * atten;
    vec3 diffuse = getDiffuse(u_material, vNormal, lightDir) * pointLight.color * atten;
    vec3 specular = getSpecular(u_material, vNormal, lightDir) * pointLight.color * atten;
    
    return ambience + diffuse + specular;
}

vec3 getDirectionalLightCast(DirectionalLight directionalLight) {
    vec3 lightDir = -normalize(directionalLight.direction);
    float intensity = 1.2;

    vec3 ambience = getAmbience(u_material) * directionalLight.color;
    vec3 diffuse = getDiffuse(u_material, vNormal, lightDir) * directionalLight.color;
    vec3 specular = getSpecular(u_material, vNormal, lightDir) * directionalLight.color;
    
    return ambience + diffuse + specular;
}

void main() {
    vec3 pointLightCast = vec3(0);
    vec3 dirLightCast = vec3(0);
    vec3 lightCast = vec3(0);

    for (int i = 0; i < NUM_LIGHTS; i++) {
    //    pointLightCast += getPointLightCast(u_pLights.lights[i]);
    }
    for (int i = 0; i < NUM_LIGHTS_DIRECTIONAL; i++) {
        dirLightCast += getDirectionalLightCast(u_dLights.lights[i]);
    }

    lightCast = dirLightCast + pointLightCast;
    
    if (u_texture.tsampler_check > 0) {
         finalColor = texture(u_texture.tsampler, texCord) * vec4(lightCast, 1.0);    
    } else {
        finalColor = vec4(lightCast, 1.0);    
    }
}