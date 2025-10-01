#version 330 core
struct Material {
    sampler2D diffuse;
    sampler2D specular;
    sampler2D emission;
    float shininess;
};

struct Light {
    vec3 position;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

out vec4 FragColor;

in vec3 FragPos;
in vec3 Normal;
in vec2 TexCoords;
  
uniform vec3 camPos;
uniform Material material;
uniform Light light;
uniform float time;

void main()
{
    vec3 ambient = light.ambient * texture(material.diffuse, TexCoords).rgb;

    vec3 norm = normalize(Normal);
    vec3 lightdir = normalize(light.position - FragPos);

    float diff = max(dot(norm, lightdir), 0.0);
    vec3 diffuse =  light.diffuse * diff * texture(material.diffuse, TexCoords).rgb;

    vec3 eyedir = normalize(camPos - FragPos);
    vec3 halfdir = normalize(lightdir + eyedir);

    float spec = pow(max(dot(halfdir, norm), 0.0), material.shininess);
    vec3 specular = light.specular * spec * texture(material.specular, TexCoords).rgb;

    // only emission if specular is 0
    vec3 emission = texture(material.emission, TexCoords + vec2(0.0, time * 0.2f)).rgb * floor(vec3(1.f) - texture(material.specular, TexCoords).rgb);

    vec3 result = ambient + diffuse + specular + emission;
    FragColor = vec4(result, 1.0);
}
