// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

// My own port of this processing code by @beesandbombs
// https://dribbble.com/shots/1696376-Circle-wave

varying vec2 vUv;
uniform vec2 u_resolution;
uniform float lightness;
uniform float unionFactor;
uniform float gradientScale;
uniform float u_time;

#pragma glslify: rotate = require(../../common/rotate)

// https://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm
float sdSphere(vec3 p, float radius) {
  return length(p) - radius;
}

float opSmoothUnion( float d1, float d2, float k ) {
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h); }

float qinticInOut(float t) {
  return t < 0.5
    ? +16.0 * pow(t, 5.0)
    : -0.5 * pow(2.0 * t - 2.0, 5.0) + 1.0;
}

float scene(vec3 p) {

  vec3 p1 = rotate(p, vec3(0.,1.,0.), 4. * 6.2831853 * sin(u_time));
  
  vec3 p2 = p1 + vec3(.5, .5, 0.) * qinticInOut(abs(sin(u_time * 3.)));
  vec3 p3 = p1 + vec3(-.5, -.5, 0.) * qinticInOut(abs(sin(u_time * 3.)));

  // union between the outer spheres
  float smaller = opSmoothUnion(
    sdSphere(p3, .25),
    sdSphere(p2, .25),
    unionFactor
  );

  float centerSphere = opSmoothUnion(
    sdSphere(p1, .25),
    smaller,
    unionFactor
  );

  return centerSphere;
}

vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
    return a + b*cos( 6.28318*(c*t+d) );
}

vec3 getColorAmount(vec3 p) {
  float amount = clamp((1.5 - length(p))/2., 0., 1.);
  vec3 color = pal( amount * gradientScale, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.10,0.20) );

  return color * amount;
}

void main()	{
    vec2 uv = (gl_FragCoord.xy/min(u_resolution.x,u_resolution.y))
              -vec2(fract(max(u_resolution.x,u_resolution.y)/min(u_resolution.x,u_resolution.y))/2.0,0.0)
              -0.5;

    vec3 camPos = vec3(0, 0, 2.);
    vec2 p = uv;
    vec3 ray = normalize(vec3(p, -1.));
    vec3 rayPos = camPos;
    float curDist = 0.;
    // from camera to point
    float rayLength = 0.;
    vec3 color = vec3(0.);
    vec3 light = vec3(1.,1.,1.);
    for (int i = 0; i <= 64; i++) {
      curDist = scene(rayPos);
      rayLength +=  0.536 * curDist;
      rayPos = camPos + ray * rayLength;
      // if hitting the object
      if (abs(curDist) < 0.0001) {
        break;
      }

      color += (lightness / 100.)  * getColorAmount(rayPos);
    }
    gl_FragColor = vec4(color, 1.);
}
