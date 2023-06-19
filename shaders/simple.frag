#version 300 es

precision lowp float;

uniform vec3 uObjMat;
uniform vec3 uAmbientLight;

uniform vec3 uLightEmission;
uniform vec3 uLightPos;

uniform vec3 uLightEmission1;
uniform vec3 uLightPos1;

uniform vec3 uLightEmission2;
uniform vec3 uLightPos2;

in vec3 normal;
in vec4 position;

out vec4 outColor;

void main()
{
    //outColor = vColor;

    vec3 ambient = uObjMat * uAmbientLight;
    //             k       * L
    vec3 diffuse = uObjMat * uLightEmission * dot(normal, normalize(uLightPos - vec3(position).xyz));
    //             k       * L              * dot(N          , L)
    vec3 diffuse1 = uObjMat * uLightEmission1 * dot(normal, (uLightPos1 - vec3(position).xyz));
    vec3 diffuse2 = uObjMat * uLightEmission2 * dot(normal, (uLightPos2 - vec3(position).xyz));
    vec4 theColor = vec4((ambient + diffuse + diffuse1 + diffuse2), 1);
    clamp(theColor, vec4(0, 0, 0, 0), vec4(1, 1, 1, 1));
    outColor = theColor;
}