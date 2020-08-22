#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform vec2 u_resolution;
uniform float lightness;
uniform float unionFactor;
uniform float gradientScale;
uniform float tiles;
uniform float density;
uniform float u_time;
uniform float radius;
uniform float speed;

float saturate_z(float x) {
  return min(1.0, max(.0,x));
}

vec3 saturate_z (vec3 x) {
  return min(vec3(1.,1.,1.), max(vec3(0.,0.,0.),x));
}

vec3 bump3y(vec3 x, vec3 yoffset) {
  vec3 y = vec3(1.,1.,1.) - x * x;
  y = saturate_z(y-yoffset);
  return y;
}

vec3 spectral_zucconi6(float x) {

  const vec3 c1 = vec3(3.54585104, 4.93225262, 1.41593945);
  const vec3 x1 = vec3(0.19549072, 0.29228336, 0.27699880);
  const vec3 y1 = vec3(0.02312639, 0.15225084, 0.22607955);

  const vec3 c2 = vec3(3.90307140, 3.21182957, 3.96587128);
  const vec3 x2 = vec3(0.11748627, 0.86755042, 0.66077860);
  const vec3 y2 = vec3(0.84897130, 0.88445281, 0.73949448);

  return
  bump3y(c1 * (x - x1), y1) +
  bump3y(c2 * (x - x2), y2);
}

vec3 zucconiPow(float x) {
  vec3 z = spectral_zucconi6(x);
  return vec3(
    pow(z.r, radius),
    pow(z.g, radius),
    pow(z.b, radius)
  );
}

#define PI 3.141593
#define TWOPI 6.283186

// https://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm
float sdCircle( vec2 p, float r )
{
    return length(p) - r;
}

float sdStar(in vec2 p, in float r, in int n, in float m)
{
    // next 4 lines can be precomputed for a given shape
    float an = 3.141593/float(n);
    float en = 3.141593/m;  // m is between 2 and n
    vec2  acs = vec2(cos(an),sin(an));
    vec2  ecs = vec2(cos(en),sin(en)); // ecs=vec2(0,1) for regular polygon,

    float bn = mod(atan(p.x,p.y),2.0*an) - an;
    p = length(p)*vec2(cos(bn),abs(sin(bn)));
    p -= r*acs;
    p += ecs*clamp( -dot(p,ecs), 0.0, r*acs.y/ecs.y);
    return length(p)*sign(p.x);
}

float opSmoothUnion( float d1, float d2, float k ) {
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h); }

float qinticInOut(float t) {
  return t < 0.5
    ? +16.0 * pow(t, 5.0)
    : -0.5 * pow(2.0 * t - 2.0, 5.0) + 1.0;
}

float wave(in float value) {
  return (sin(value));
}


vec2 tile(vec2 st, float zoom){
    st *= zoom;
    return fract(st);
}

vec3 getCol(vec2 uv) {

    float time = u_time * speed;

   float angle = atan(uv.x - 1., uv.y + 1.);
    float dist = sdCircle(uv - 0.5, 1.);

    float d = dist
      + wave(angle * .25 + time) * .25 * sin(time * .5)
      + wave(angle * .5 + time) * .5 * sin(time * .5);

    float luma = wave( (d * density) - sin(time) * 10.) * radius;
    
    vec3 col = vec3(
      spectral_zucconi6(
        abs(-1. + abs(mod(luma + uv.y * 2. + d + 0. + sin(time) * 0.25, 1.)))
      )
    );

    return col;

}


void main()	{
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;

    vec2 grid = tile(uv, tiles);
    vec2 grid2 = tile(uv, tiles * 2.);
    vec2 grid3 = tile(uv, tiles * 12.);

    vec3 col = getCol(grid);
    vec3 col2 = getCol(grid2);
    vec3 col3 = getCol(grid3);

    vec3 mixed = max(col, col2);

    gl_FragColor = vec4(mix(mixed, col3, .4), 1.);
}
