#version 300 es

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProj;

in vec4 aPosition;

out vec4 position;

void main()
{
    mat4 mView2 = mat4(mat3(uModel * uView));
    gl_Position = uProj * mView2 * aPosition;
    position = uProj * mView2 * aPosition;

}