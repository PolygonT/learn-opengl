#version 330 core
layout (location = 0) in vec3 aPos;
layout (location = 1) in vec3 aNormal;

out vec3 FragPos;
out vec3 Normal;
out vec4 v_FragColor;

uniform vec3 lightColor;
uniform vec3 lightPos;
uniform vec3 camPos;
uniform vec3 objectColor;
uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main()
{
    vec4 FragPos4 = model * vec4(aPos, 1.0);
    FragPos = vec3(FragPos4);
    // TODO if have non-uniform scale, shoule multi normal matrix
    Normal = aNormal;
    

	gl_Position = projection * view * FragPos4;

    vec3 ambient = 0.1 * lightColor;

    vec3 norm = normalize(aNormal);
    vec3 lightdir = normalize(lightPos - aPos);

    float diff = max(dot(norm, lightdir), 0.0);
    vec3 diffuse =  diff * lightColor;

    vec3 eyedir = normalize(camPos - FragPos);
    vec3 halfdir = normalize(lightdir + eyedir);

    float spec = pow(max(dot(halfdir, norm), 0.0), 80);
    vec3 specular = 0.5 * spec * lightColor;

    vec3 result = (ambient + diffuse + specular) * objectColor;
    v_FragColor = vec4(result, 1.0);
}
