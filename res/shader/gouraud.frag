#version 330 core
out vec4 FragColor;

in vec3 FragPos;
in vec3 Normal;
in vec4 v_FragColor;
  

void main()
{
    FragColor = v_FragColor;
}
