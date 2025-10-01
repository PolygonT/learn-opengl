#version 330 core
layout (location = 0) in vec3 aPos;
layout (location = 1) in vec3 aNormal;

out vec3 FragPos;
out vec3 Normal;

uniform vec3 lightPos;
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
}
