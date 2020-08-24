#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D bufferTexture;
uniform float number;
uniform float size;

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

float cross(in vec2 _st, float _size){
    return  box(_st, vec2(_size,_size/4.)) +
            box(_st, vec2(_size/4.,_size));
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}


void main()	{
  vec2 st = gl_FragCoord.xy/u_resolution.xy;

  vec3 color = vec3(0.);
  color = .8 * texture2D(bufferTexture, st + vec2(0., 0.003)).rgb;

  st.x *= u_resolution.x/u_resolution.y;
  st *= number;
  st = fract(st);

  st += vec2(sin(u_time) / 4.);

  st -= vec2(0.5);
  // // rotate the space
  st = rotate2d( u_time ) * st;
  // // move it back to the original place
  st += vec2(0.5);


  color += vec3(box(st,vec2(size)));

  gl_FragColor = vec4(color,1.0);
}
