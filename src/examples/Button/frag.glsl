uniform float u_time;
uniform vec2 u_resolution;

uniform float glowFalloff;
uniform float glowRange;

uniform vec3 color;
uniform float fresnelMultiplier;
uniform float fresnelNoiseMultiplier;
uniform float fresnelExponent;
uniform vec3 fresnelColor;

uniform sampler2D noiseTexture;
uniform sampler2D bodyTexture;

uniform vec3 bodyColor;
uniform float colorMultiplier;

uniform float noiseFresnelExponent;

varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vColor;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d) 

void main() {

  vec2 uv = vUv;
  float fresnel = dot(vNormal, vec3(0, 0, 1));

  float bFresnel = fresnel;

  float localnoise = snoise2((uv) + u_time);

  fresnel = 1. - fresnel;
  fresnel = pow(fresnel, fresnelExponent);

  float x = texture2D(noiseTexture, uv + vec2(u_time)).r;
  x = pow(x + localnoise, noiseFresnelExponent);

  vec3 ncolor = vec3(color);
  
  ncolor += fresnel * fresnelColor * fresnelMultiplier;
  ncolor *= (fresnel * x * fresnelNoiseMultiplier);
  ncolor += fresnel * fresnelColor  * 5.;

  vec3 zcolor = colorMultiplier * bodyColor * .2;
  // zcolor *= texture2D(bodyTexture, uv - vec2(u_time / 2., 0.)).rgb;

  ncolor += zcolor;

  gl_FragColor = vec4(ncolor, 1.);
}
