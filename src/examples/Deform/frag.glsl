// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

uniform sampler2D samplerTxt;
uniform sampler2D uvMap;

uniform float scale;
uniform float intensity;

varying vec2 vUv;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d) 

void main() {
    vec2 uv = vUv;
    
    vec3 color = vec3(0., 1., 0.);

    float n = snoise2(scale * uv + vec2(0., u_time));

    uv += n * 0.05 * intensity;

    vec3 samplercol = texture2D(samplerTxt, uv).rgb;

    // gl_FragColor = vec4(uv, 1., 1.);
    gl_FragColor = vec4(samplercol, 1.0 );
} 
