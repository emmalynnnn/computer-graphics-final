#version 300 es

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProj;

in vec4 aPosition;
in vec4 aNormal;

out vec3 normal;
out vec4 position;

void main()
{
    gl_Position = uProj * uView * uModel * aPosition;

    vec4 aAdjusted = transpose(inverse(uView * uModel)) * aNormal;
    vec3 aNormalized = normalize(vec3(aAdjusted).xyz);

    normal = aNormalized;
    position = gl_Position;

}