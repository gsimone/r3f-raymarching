uniform float time;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
#pragma glslify: rotate = require(../../common/rotate)

// https://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm
float sdSphere(vec3 p, float radius) {
  return length(p) - radius;
}

float sdOctahedron( vec3 p, float s)
{
  p = abs(p);
  return (p.x+p.y+p.z-s)*0.57735027;
}

float sdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float opUnion( float d1, float d2 ) { return min(d1,d2); }

float opSubtraction( float d1, float d2 ) { return max(-d1,d2); }

float opIntersection( float d1, float d2 ) { return max(d1,d2); }


float scene(vec3 p) {

  vec3 p1 = rotate(p, vec3(1.,0.,0.), time * 6.283185);
  vec3 p2 = rotate(p, vec3(1.), -time * 6.283185);
  
  float scale  = 12.;

  float minO = max(
    sdSphere(p, .4),
    sdBox(p2, vec3(.3))
  );

  float frame = opSubtraction(
    sdSphere(p, .4),
    minO
  );

  return min(frame, sdOctahedron(p1, .3)); 
}

vec3 getColorAmount(vec3 p) {
  float amount = clamp((1.5 - length(p))/2., 0., 1.);
  vec3 color = 0.5 + .5 * cos(6.28319 * (vec3(0.2, 0.,0.) + amount * vec3(1., 1., 0.5)));

  return color * amount;

}

void main()	{
    vec2 uv = vUv;
  
    vec3 camPos = vec3(0, 0, 2.);
    vec2 p = uv - vec2(0.5);
    vec3 ray = normalize(vec3(p, -1.));
    vec3 rayPos = camPos;
    float curDist = 0.;
    // from camera to point
    float rayLength = 0.;
    vec3 color = vec3(0.);
    vec3 light = vec3(1.,1.,1.);
    for (int i = 0; i <= 128; i++) {
      curDist = scene(rayPos);
      rayLength +=  0.6 * curDist;
      rayPos = camPos + ray * rayLength;
      // if hitting the object
      if (abs(curDist) < 0.001) {
        break;
      }

      color += 0.02 * getColorAmount(rayPos);
    }
    gl_FragColor = vec4(color, 1.);
}
