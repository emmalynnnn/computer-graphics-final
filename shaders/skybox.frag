#version 300 es

precision lowp float;

uniform samplerCube uSampler;

in vec4 position;

out vec4 outColor;

void main()
{
    vec4 color = texture(uSampler, position);

    outColor = color;
}



