import * as THREE from 'three' 
import React, { useRef, useMemo, Suspense } from "react";
import {  PerspectiveCamera, Plane, shaderMaterial, Text, useAspect  } from "drei";
import { Canvas, useFrame, extend, createPortal } from "react-three-fiber";

import frag from './frag.glsl'
import vert from './vert.glsl'

extend({ SphereExampleMaterial: shaderMaterial({ resolution: [0, 0], time: 0, text: null }, vert, frag) });

function Scene() {
  const mat = useRef();

  useFrame(({ clock }) => {
    mat.current.uniforms.time.value = clock.getElapsedTime() / 6.
  });

  const scale = useAspect("cover", window.innerWidth, window.innerHeight, 1);

  const cam = useRef()
  const [scene, target] = useMemo(() => {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#000')
    const target = new THREE.WebGLMultisampleRenderTarget(1024, 1024, {
      format: THREE.RGBFormat,
      stencilBuffer: false
    })
    target.samples = 8
    return [scene, target]
  }, [])

  useFrame((state) => {
    state.gl.setRenderTarget(target)

    state.gl.render(scene, cam.current)
    state.gl.setRenderTarget(null)
  })
  
  return (
    <>
      {createPortal(<>
        <Text 
          maxWidth={10}
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          fontSize={1} color="white">
          React
          three
          Fiber
        </Text>
        <PerspectiveCamera ref={cam} position={[0, 0, 4]} />
      </>, scene)}
      <Plane scale={[...scale, 1]}>
        <sphereExampleMaterial 
          ref={mat} 
          text={target.texture} 
          resolution={[window.innerWidth, window.innerHeight]}
        />
      </Plane>
    </>
  );
}

export default function CubeExample() {
  return (
    <Canvas
      shadowMap
      colorManagement
      camera={{ position: [0, 0, 2], far: 50 }}
      style={{
        background: "#000",
      }}
      concurrent
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
