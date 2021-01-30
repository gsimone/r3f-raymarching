uniform float u_time;
uniform vec2 u_resolution;

uniform float fresnelBias;
uniform float fresnelPower;
uniform float fresnelScale;

varying vec3 vPosition;
varying vec3 vNormal;
varying float vNoise;
varying vec3 vColor;
varying vec2 vUv;
varying vec4 vWorldPosition;

varying float vReflectionFactor;

void main()	{
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
	vec4 worldPosition = modelMatrix * vec4( position, 1.0 );

	vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );

	vec3 I = worldPosition.xyz - cameraPosition;
	vReflectionFactor = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), fresnelPower );

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}
