import React, { useMemo, useRef } from "react";
import { Icosahedron, Plane, shaderMaterial } from "drei";
import { useFrame, extend } from "react-three-fiber";
import glsl from "babel-plugin-glsl/macro";

const frag =
glsl`
uniform float time;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

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

 rotate(vec3 v, vec3 axis, float angle) {
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.0)).xyz;
}


// https://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm
float sdSphere(vec3 p, float radius) {
  return length(p) - radius;
}

float sdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float SineCrazy(vec3 p) {

  return 1. - (sin(p.x) + sin(p.y) + sin(p.z)) / 3.; 

}

vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

float sdOctahedron( vec3 p, float s)
{
  p = abs(p);
  return (p.x+p.y+p.z-s)*0.57735027;
}

float opSmoothUnion( float d1, float d2, float k ) {
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h); }

float scene(vec3 p) {

  vec3 p1 = rotate(p, vec3(1.,1.,1.), time);

  float scale  = 10. + 5. * sin(time);

  float f = max(
    sdOctahedron(p1, .5),
    (0.85 - SineCrazy(p1 * scale)) / scale
  );

  return opSmoothUnion( sdSphere(p1, .25 + .5 * sin(time)), sdBox(p1, vec3(.4)), .4 );
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


vec3 getColorAmount(vec3 p) {

  float amount = clamp(1.5 - length(p)/2., 0., 1.);

  vec3 col = pal( amount, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,0.5),vec3(0.8,0.90,0.30) );

  return col * amount;

} 

void main()	{

    vec3 camPos = vec3(0, 0, 2.);


    vec2 p = vUv - vec2(0.5);
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

        vec3 norm = getNormal(rayPos);

        float diff = dot(norm, light);

        break;
 
      }

      color += 0.01 * getColorAmount(rayPos);

    }

    gl_FragColor = vec4(color, 1.);
}
`

const vert = glsl`
  varying vec2 vUv;

  void main()	{
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
  }
`;

extend({ MyMaterial: shaderMaterial({ time: 0 }, vert, glsl`${frag}`) }) 

function Scene() {
  
  const mat = useRef()
  useFrame(() => {
    mat.current.uniforms.time.value += 1;
  });
  
  return (
    <Plane>
      <myMaterial ref={mat} />
    </Plane>
  );
}

export default Scene;
