// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

uniform float tint;
uniform float lacunarity;
uniform float gain;
uniform vec3 primary;
uniform vec3 secondary;
uniform vec3 shades;
uniform vec3 edges;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d) 
#pragma glslify: rotate = require(../../common/rotate)

#define OCTAVES 6

// Ridged multifractal
// See "Texturing & Modeling, A Procedural Approach", Chapter 12
float ridge(float h, float offset) {
    h = abs(h);     // create creases
    h = offset - h; // invert so creases are at top
    h = h * h;      // sharpen creases
    return h;
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

float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
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

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    
    vec3 color = vec3(0.0);

    vec2 q = vec2(0.);
    q.x = fbm( st + 0.1 * u_time);
    q.y = fbm( st + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = fbm( st + 1.0 * q + vec2(1.7,9.2)+ 0.15 * u_time );
    r.y = fbm( st + 1.0 * q + vec2(8.3,2.8)+ 0.126 * u_time);

    float f = fbm(st+r);

    color = mix(vec3(edges),
                vec3(secondary),
                clamp((f*f)*4.0,0.0,1.0));

    color = mix(color,
                shades,
                clamp(length(q),0.0,1.0));

    color = mix(color,
                primary,
                clamp(length(r.x),0.0,1.0));

    gl_FragColor = vec4( color, 1.0 );
} 
