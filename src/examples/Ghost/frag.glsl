// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

// My own port of this processing code by @beesandbombs
// https://dribbble.com/shots/1696376-Circle-wave

varying vec2 vUv;
uniform vec2 resolution;
uniform float time;

// https://gist.github.com/yiwenl/3f804e80d0930e34a0b33359259b556c
mat4 rotationMatrix(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;
  
  return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
              oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
              oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
              0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
  mat4 m = rotationMatrix(axis, angle);
  return (m * vec4(v, 1.0)).xyz;
}

// https://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm
float sdSphere(vec3 p, float radius) {
  return length(p) - radius;
}

float SineCrazy(vec3 p) {
  return 1. - (sin(p.x) + sin(p.y) + sin(p.z)) / 3.; 
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

vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

float opSmoothUnion( float d1, float d2, float k ) {
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h); }

float opSmoothSubtraction( float d1, float d2, float k ) {
    float h = clamp( 0.5 - 0.5*(d2+d1)/k, 0.0, 1.0 );
    return mix( d2, -d1, h ) + k*h*(1.0-h); }

float opSmoothIntersection( float d1, float d2, float k ) {
    float h = clamp( 0.5 - 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) + k*h*(1.0-h); }

float opUnion( float d1, float d2 ) { return min(d1,d2); }

float opSubtraction( float d1, float d2 ) { return max(-d1,d2); }

float opIntersection( float d1, float d2 ) { return max(d1,d2); }

float qinticInOut(float t) {
  return t < 0.5
    ? +16.0 * pow(t, 5.0)
    : -0.5 * pow(2.0 * t - 2.0, 5.0) + 1.0;
}

float ear(vec3 p, float pos) {
  return sdSphere(p + vec3(pos * .22, -.2, -.1), .05);
}

float sdRoundCone( vec3 p, float r1, float r2, float h )
{
  vec2 q = vec2( length(p.xz), p.y );
    
  float b = (r1-r2)/h;
  float a = sqrt(1.0-b*b);
  float k = dot(q,vec2(-b,a));
    
  if( k < 0.0 ) return length(q) - r1;
  if( k > a*h ) return length(q-vec2(0.0,h)) - r2;
        
  return dot(q, vec2(a,b) ) - r1;
}

float scene(vec3 p) {

  p = rotate(p, vec3(0., 1., 0.), .0);
  vec3 p1 = p + vec3(0., -.2, 0.) + (vec3(0.,.04,0.) * sin(time * 20.));
  vec3 tailP = p1 + vec3(.1, 0., 0.) * sin(time * 20.);
  
  float tailT = sin(time * 10.);
  float tail = opSmoothUnion(
      sdSphere(p1 + vec3(0, .2, 0), .12),
      sdSphere(p1 + vec3(0., .6, 0.) + vec3(-.3 * tailT, .02 * tailT, 0), .02),
      .5
    );

  // union between the outer spheres
  float body = opSmoothUnion(
    opSmoothUnion(
      sdSphere(p1 + vec3(0, .25, 0), .15),
      tail,
      .5
    ),
    sdSphere(p1, .3),
    0.2
  );

  float ears = min(ear(p1, -1.), ear(p1, 1.));

  float bodyWithEars = opSmoothUnion(
    ears,
    body,
    .04
  );

  float eyeSize = .07;
  float eyesX = 0.15;
  float leftEyeSocket = sdSphere(p1 + vec3(eyesX, 0., -0.3), eyeSize);
  float rightEyeSocket = sdSphere(p1 + vec3(-eyesX, 0., -0.3), eyeSize);

  float bodyWithEyeSockets = opSubtraction(
    min(leftEyeSocket, rightEyeSocket),
    bodyWithEars
  );

  float hands = min(
    sdSphere(p1 + vec3(.34, .1, -0.1), .1),
    sdSphere(p1 + vec3(-.34, .1, -0.1), .1)
  );

  return opSmoothUnion(bodyWithEars, hands, .1);
}

// get normal for each point in the scene
vec3 getNormal(vec3 p){
	
	vec2 o = vec2(0.001,0.);
	// 0.001,0,0
	return normalize(
		vec3(
			scene(p + o.xyy) - scene(p - o.xyy),
			scene(p + o.yxy) - scene(p - o.yxy),
			scene(p + o.yyx) - scene(p - o.yyx)
		)
	);
}



vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

vec3 getColorAmount(vec3 p) {
  float amount = clamp((1.5 - length(p))/2., 0., 1.);

  
  vec3 color = pal( amount, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.10,0.20) );

  return color * amount;

}

void main()	{
    float x = resolution.x / resolution.y;
    
    vec2 uv = vUv * vec2(x, 1.) + vec2((1. - x)/2., 0.);
  
    vec3 camPos = vec3(0, 0, 2.);
    vec2 p = uv - vec2(0.5);
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
      if (abs(curDist) < 0.001) {
        break;
      }

      color += 0.05 * getColorAmount(rayPos);
    }
    gl_FragColor = vec4(color, 1.);
}
