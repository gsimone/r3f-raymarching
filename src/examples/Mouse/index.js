/**
 *
 * A simple example of using the mouse to navigate the scene by moving the camera.
 * Mouse and zoom vectors are passed to the shader as uniforms.
 *
 */
import * as THREE from 'three'
import React, { useRef } from "react";
import { Plane, shaderMaterial, useAspect } from "drei";
import { Canvas, useFrame, extend } from "react-three-fiber";
import { useGesture } from "react-use-gesture";

import frag from './frag.glsl'
import vert from './vert.glsl'

import "styled-components/macro"


extend({
  MyMouseShaderMaterial: shaderMaterial(
    { 
      time: 0, 
      mouse: [0, 0], 
      pos: [0, 0, 0]
    },
    vert,
    frag
  ),
});


function Scene() {
  const pos = useRef(new THREE.Vector3(0, 0, 0))
  
  const mat = useRef();

  const bind = useGesture({
    onDrag: ({ offset: [x, y], vxvy: [vx, vy], down, ...props }) => {
      pos.current.x += vx / 100
      pos.current.y += vy / 100
    },
    onWheel: ({ movement }) => { 
      const [, mov] = movement; 
      pos.current.z += mov / 100; 
    }
  })

  useFrame(({ mouse }) => {
    mat.current.uniforms.time.value += 1 / 20;
    mat.current.uniforms.mouse.value = [mouse.x, mouse.y];

    mat.current.uniforms.pos.value = pos.current;
  });

  const [sx, sy] = useAspect("cover", window.innerWidth, window.innerHeight, 1);
  const s = Math.min(sx,sy);

  return (
    <Plane scale={[s, s, 1]} {...bind()} >
      <myMouseShaderMaterial ref={mat} />
    </Plane>
  );
}

export default function CubeExample() {
  
  return (
    <Canvas
      shadowMap
      colorManagement
      camera={{ position: [0, 0, 2], far: 50 }}
      css={`
        canvas {
          touch-action: none;
        }
      `}
      concurrent
    >
      <Scene />
    </Canvas>
  );
}
