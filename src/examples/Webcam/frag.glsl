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

float ridge(float h, float offset) {
    h = abs(h);     // create creases
    h = offset - h; // invert so creases are at top
    h = h * h;      // sharpen creases
    return h;
}

# define OCTAVES 1
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = 0.1;
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

float ridgedMF(vec2 p) {
    float offset = 0.9;

    float sum = 0.0;
    float freq = 1.0, amp = 0.5;
    float prev = 1.0;
    for(int i=0; i < OCTAVES; i++) {
        float n = ridge(snoise2(p*freq), offset);
        sum += n*amp;
        sum += n*amp*prev;  // scale by previous octave
        prev = n;
        freq *= lacunarity;
        amp *= gain;
    }
    return sum;
}

void main()	{
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st.x *= u_resolution.x/u_resolution.y;

  vec3 video = texture2D(videoTexture, vec2(ridgedMF(st))).rgb;

  gl_FragColor = vec4(video,1.0);
}
