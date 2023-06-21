#version 300 es

precision lowp float;

uniform vec3 uObjMat;
uniform vec3 uAmbientLight;

uniform vec3 uLightEmission;
uniform vec3 uLightPos;

//uniform vec3 uLightEmission1;
//uniform vec3 uLightPos1;

//uniform vec3 uLightEmission2;
//uniform vec3 uLightPos2;

uniform vec3 uSpecLight;
uniform vec3 uSpecPos;
uniform float shiny;

in vec3 normal;
in vec4 position;

out vec4 outColor;

void main()
{
    vec3 ambient = uObjMat * uAmbientLight;
    //             k       * L
    vec3 L = normalize(uLightPos - vec3(position).xyz);
    vec3 diffuse = uObjMat * uLightEmission * dot(normal, L);
    //             k       * L              * dot(N     , L);

    vec3 V = normalize(-1.0 * vec3(position).xyz);
    vec3 R = (2.0 * dot(normal, L) * normal) - L;
    vec3 specular = uSpecLight * uSpecPos * pow(max(dot(V, R), 0.0), shiny);
    //              k          * L        *         dot(V, R)        ^n

    vec4 theColor = vec4((ambient + diffuse + specular), 1.0);
    clamp(theColor, vec4(0, 0, 0, 0), vec4(1, 1, 1, 1));
    outColor = theColor;
}