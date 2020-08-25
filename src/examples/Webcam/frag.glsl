#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D bufferTexture;
uniform sampler2D videoTexture;
uniform float number;
uniform float size;
uniform float lacunarity;
uniform float gain;

float box(in vec2 _st, in vec2 _size){
    _size = vec2(0.5) - _size*0.5;
    vec2 uv = smoothstep(_size,
                        _size+vec2(0.001),
                        _st);
    uv *= smoothstep(_size,
                    _size+vec2(0.001),
                    vec2(1.0)-_st);
    return uv.x*uv.y;
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d) 

# define OCTAVES 3
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = 1.;
    float frequency = 0.;
    // Loop of OCTAVES
    float prev = 1.0;
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * abs(snoise2(st));
        st *= lacunarity;
        amplitude *= gain;
    }
    return value;
}

void main()	{
  vec2 st = gl_FragCoord.xy/u_resolution.xy;

  vec2 fbmDist = vec2(0.0);
  fbmDist.x = fbm(st + u_time / 4. * 0.1);
  fbmDist.y = fbm(st + u_time / 4.);

  vec3 color = vec3(0.);
  
  vec3 video = texture2D(videoTexture, vec2(fbmDist)).rgb;

  gl_FragColor = vec4(video,1.0);
}
