#version 330 core
struct Material {
    sampler2D diffuse;
    sampler2D specular;
    sampler2D emission;
    float shininess;
};

struct PointLight {
    vec3 position;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;

    float constant;
    float linear;
    float quadratic;
};

struct DirLight {
    vec3 direction;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

struct SpotLight {
    vec3 position;
    vec3 direction;
    float innerCutOff;
    float outerCutOff;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;

    float constant;
    float linear;
    float quadratic;
};

out vec4 FragColor;

in vec3 FragPos;
in vec3 Normal;
in vec2 TexCoords;
  
uniform vec3 camPos;
uniform Material material;
uniform PointLight pointLight;
uniform DirLight dirLight;
uniform SpotLight spotLight;
uniform float time;

vec3 calcPointLight(PointLight light, vec3 normal, vec3 viewDir);
vec3 calcDirLight(DirLight light, vec3 normal, vec3 viewDir);
vec3 calcSpotLight(SpotLight light, vec3 normal, vec3 viewDir);

void main()
{
    vec3 normal = normalize(Normal);
    vec3 viewDir = normalize(camPos - FragPos);
    vec3 calcPointLight = calcPointLight(pointLight, normal, viewDir);
    vec3 calcDirLight = calcDirLight(dirLight, normal, viewDir);
    vec3 calcSpotLight = calcSpotLight(spotLight, normal, viewDir);
    FragColor = vec4(calcSpotLight, 1.0);
}

vec3 calcPointLight(PointLight light, vec3 normal, vec3 viewDir) {
    vec3 ambient = light.ambient * texture(material.diffuse, TexCoords).rgb;

    vec3 lightdir = normalize(light.position - FragPos);

    float diff = max(dot(normal, lightdir), 0.0);
    vec3 diffuse =  light.diffuse * diff * texture(material.diffuse, TexCoords).rgb;

    vec3 halfDir = normalize(lightdir + viewDir);

    float spec = pow(max(dot(halfDir, normal), 0.0), material.shininess);
    vec3 specular = light.specular * spec * texture(material.specular, TexCoords).rgb;

    // only emission if specular is 0
    vec3 emission = texture(material.emission, TexCoords + vec2(0.0, time * 0.2f)).rgb 
        * floor(vec3(1.f) - texture(material.specular, TexCoords).rgb);

    float distance = length(light.position - FragPos);
    float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * distance * distance);

    return (ambient + diffuse + specular + emission) * attenuation;
}

vec3 calcDirLight(DirLight light, vec3 normal, vec3 viewDir) {
    vec3 ambient = light.ambient * texture(material.diffuse, TexCoords).rgb;

    vec3 lightdir = normalize(-light.direction);

    float diff = max(dot(normal, lightdir), 0.0);
    vec3 diffuse =  light.diffuse * diff * texture(material.diffuse, TexCoords).rgb;

    vec3 halfDir = normalize(lightdir + viewDir);

    float spec = pow(max(dot(halfDir, normal), 0.0), material.shininess);
    vec3 specular = light.specular * spec * texture(material.specular, TexCoords).rgb;

    // only emission if specular is 0
    // vec3 emission = texture(material.emission, TexCoords + vec2(0.0, time * 0.2f)).rgb 
    //     * floor(vec3(1.f) - texture(material.specular, TexCoords).rgb);

    // directional light没有距离衰减attenuation
    return ambient + diffuse + specular;

}

vec3 calcSpotLight(SpotLight light, vec3 normal, vec3 viewDir) {
    vec3 lightdir = normalize(light.position - FragPos);
    float cosTheta = dot(lightdir, -normalize(light.direction));

    vec3 result = vec3(0.0, 0.0, 0.0);
    if (cosTheta > light.innerCutOff) {
        // inner cone
        vec3 ambient = light.ambient * texture(material.diffuse, TexCoords).rgb;

        float diff = max(dot(normal, lightdir), 0.0);
        vec3 diffuse =  light.diffuse * diff * texture(material.diffuse, TexCoords).rgb;

        vec3 halfDir = normalize(lightdir + viewDir);

        float spec = pow(max(dot(halfDir, normal), 0.0), material.shininess);
        vec3 specular = light.specular * spec * texture(material.specular, TexCoords).rgb;

        // only emission if specular is 0
        vec3 emission = texture(material.emission, TexCoords + vec2(0.0, time * 0.2)).rgb 
            * floor(vec3(1.0) - texture(material.specular, TexCoords).rgb);

        float distance = length(light.position - FragPos);
        float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * distance * distance);

        result = (ambient + diffuse + specular) * attenuation;
    } else if (cosTheta > light.outerCutOff) {
        // outer cone
        vec3 ambient = light.ambient * texture(material.diffuse, TexCoords).rgb;

        float diff = max(dot(normal, lightdir), 0.0);
        vec3 diffuse =  light.diffuse * diff * texture(material.diffuse, TexCoords).rgb;

        vec3 halfDir = normalize(lightdir + viewDir);

        float spec = pow(max(dot(halfDir, normal), 0.0), material.shininess);
        vec3 specular = light.specular * spec * texture(material.specular, TexCoords).rgb;

        // only emission if specular is 0
        vec3 emission = texture(material.emission, TexCoords + vec2(0.0, time * 0.2)).rgb 
            * floor(vec3(1.0) - texture(material.specular, TexCoords).rgb);

        float distance = length(light.position - FragPos);
        float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * distance * distance);

        // light intensity
        float I = (cosTheta - light.outerCutOff) / (light.innerCutOff - light.outerCutOff);
        // leave ambient light unaffected 这里环境光让不受光照强度递减影响
        diffuse *= I;
        specular *= I;
        result = (ambient + diffuse + specular) * attenuation;
    }

    return result;
}
