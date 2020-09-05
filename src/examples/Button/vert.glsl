uniform float u_time;
uniform vec2 u_resolution;

varying vec3 vPosition;
varying vec3 vNormal;
varying float vNoise;
varying vec3 vColor;
varying vec2 vUv;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

void main()	{
    vUv = uv;
    float updateTime = u_time;

    vec3 world_space_normal = vec3(modelViewMatrix * vec4(normal, 0.0));
    vNormal = normal;
    
    float noise = snoise3(vec3(position + updateTime));
    vNoise = noise;
    vPosition = position;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
