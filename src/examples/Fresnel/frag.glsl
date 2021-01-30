uniform float u_time;
uniform vec2 u_resolution;
uniform vec3 u_camera;

uniform float glowFalloff;
uniform float glowRange;

uniform vec3 color;
uniform float fresnelMultiplier;
uniform float fresnelNoiseMultiplier;
uniform float fresnelExponent;
uniform vec3 fresnelColor;

uniform sampler2D normalMap;
uniform sampler2D noiseTexture;
uniform sampler2D bodyTexture;

uniform vec3 mainColor;
uniform float mainColorMix;
uniform vec3 noiseColor;
uniform float noiseScale;

uniform float colorMultiplier;
uniform float noiseFresnelExponent;

varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vColor;
varying vec4 vWorldPosition;

varying float vReflectionFactor;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d) 

vec3 blend(vec3 col1, vec3 col2, float mixValue) {

  return col1 + col2;
}

void main() {

  vec2 uv = vUv;

  float noiseT = texture2D(noiseTexture, uv * noiseScale + vec2(u_time)).r;
  // x = pow(x + localnoise, noiseFresnelExponent);
  // noiseT += pow(localnoise + noiseT, vReflectionFactor * 10.);
  noiseT *= 4.;

  // vec3 ncolor = vec3(color);
  
  // ncolor += fresnel * fresnelColor * fresnelMultiplier;
  // ncolor *= (fresnel * x * fresnelNoiseMultiplier);
  // ncolor += fresnel * fresnelColor  * 5.;

  // vec3 zcolor = colorMultiplier * bodyColor * .2;
  // zcolor *= texture2D(bodyTexture, uv - vec2(u_time / 2., 0.)).rgb;

  // ncolor += zcolor;

  vec3 finalColor = blend(mainColor, noiseT * vReflectionFactor * noiseColor, mainColorMix);
  finalColor =finalColor + vec3(.1) * vReflectionFactor;

  gl_FragColor = vec4(finalColor, .94);
}
