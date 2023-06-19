#version 300 es

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProj;

uniform vec3 uObjMat;
uniform vec3 uAmbientLight;

uniform vec3 uLightEmission;
uniform vec3 uLightPos;

uniform vec3 uLightEmission1;
uniform vec3 uLightPos1;

uniform vec3 uLightEmission2;
uniform vec3 uLightPos2;

in vec4 aPosition;
in vec4 aNormal;

out vec4 vColor;

void main()
{

    gl_Position = uProj * uView * uModel * aPosition;

    vec4 aAdjusted = transpose(inverse(uView * uModel)) * aNormal;
    vec3 aNormalized = normalize(vec3(aAdjusted).xyz);

    vec3 ambient = uObjMat * uAmbientLight;
    //             k       * L
    vec3 diffuse = uObjMat * uLightEmission * dot(aNormalized, normalize(uLightPos - vec3(aPosition).xyz));
    //             k       * L              * dot(N          , L)
    vec3 diffuse1 = uObjMat * uLightEmission1 * dot(aNormalized, (uLightPos1 - vec3(aPosition).xyz));
    vec3 diffuse2 = uObjMat * uLightEmission2 * dot(aNormalized, (uLightPos2 - vec3(aPosition).xyz));
    vec4 theColor = vec4((ambient + diffuse + diffuse1 + diffuse2), 1);
    clamp(theColor, vec4(0, 0, 0, 0), vec4(1, 1, 1, 1));
    vColor = theColor;

}