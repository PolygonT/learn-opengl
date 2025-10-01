#version 330 core
out vec4 FragColor;

in vec3 FragPos;
in vec3 Normal;

uniform vec3 lightPos;
uniform vec3 camPos;
uniform vec3 lightColor;
uniform vec3 objectColor;

void main()
{
    vec3 ambient = 0.1 * lightColor;


    vec3 norm = normalize(Normal);
    vec3 lightdir = normalize(lightPos - FragPos);

    float diff = max(dot(norm, lightdir), 0.0);
    vec3 diffuse =  diff * lightColor;

    vec3 eyedir = normalize(camPos - FragPos);
    vec3 halfdir = normalize(lightdir + eyedir);

    float spec = pow(max(dot(halfdir, norm), 0.0), 240);
    vec3 specular = 0.5 * spec * lightColor;

    vec3 result = (ambient + diffuse + specular) * objectColor;
    FragColor = vec4(result, 1.0);
}
