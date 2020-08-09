import * as THREE from 'three'
import React, { useMemo, useRef } from "react";
import {Plane, shaderMaterial, useAspect } from "drei";
import { Canvas, useFrame, extend } from "react-three-fiber";
import glsl from "babel-plugin-glsl/macro";
import { useWheel } from 'react-use-gesture';

// prettier ignore
const frag =
glsl`
uniform vec2 mouse;
uniform float time;
uniform float wheel;

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

float scene(vec3 p) {

  vec3 p1 = rotate(p, vec3(1.,1.,1.), time);

  float scale  = 10. + 5. * sin(time);

  return SineCrazy(p * 6.);
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

  vec3 col = pal( amount, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.10,0.20) );

  return col * amount;

} 

void main()	{
    vec2 uv = vUv;
  
    vec3 camPos = vec3(mouse, wheel / 200.);

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

      color += 0.01 * getColorAmount(rayPos);

    }

    gl_FragColor = vec4(color, 1.);
}
`

// prettier-ignore
const vert = 
glsl`
  varying vec2 vUv;

  void main()	{
    vUv = uv;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
  }
`;

extend({ MyMaterial: shaderMaterial({ time: 0, mouse: [0, 0], wheel: 0 }, vert, glsl`${frag}`) }) 

function Scene() {
  
    const mouseV = useMemo(() => new THREE.Vector2(0, 0), [])
    
    const bind = useWheel(({ movement }) => {
        const [,mov] = movement
        mat.current.uniforms.wheel.value += mov
    })
    
  const mat = useRef()
  useFrame(({ mouse }) => {
    mat.current.uniforms.time.value += 1 / 20;

    mouseV.set(mouse.x,mouse.y)

    mat.current.uniforms.mouse.value = mouseV;
  });

  const scale = useAspect("cover", window.innerWidth, window.innerHeight, 1)
  const s = Math.min(...scale.slice(0, 2))

  return (
    <Plane scale={[s, s, 1]} {...bind()}>
      <myMaterial ref={mat} />
    </Plane>
  );
}

export default function CubeExample() {
  return (
    <Canvas
      shadowMap
      colorManagement
      camera={{ position: [0, 0, 2], far: 50 }}
      style={{
        background: "#121212",
      }}
      concurrent
    >
      <Scene />
    </Canvas>
  )
};
