import * as THREE from 'three' 
import React, { useRef, useMemo, Suspense } from "react";
import {  PerspectiveCamera, Plane, shaderMaterial, Stats, Text, useAspect  } from "drei";
import { Canvas, useFrame, extend, createPortal } from "react-three-fiber";

import frag from './frag.glsl'
import vert from './vert.glsl'

extend({ SphereExampleMaterial: shaderMaterial({ resolution: [0, 0], time: 0, text: null }, vert, frag) });

function useRenderTargetTexture() {

  const camera = useRef()
  
  const [scene, target] = useMemo(() => {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#000')
    const target = new THREE.WebGLMultisampleRenderTarget(1024, 1024, {
      format: THREE.RGBFormat,
      stencilBuffer: false,
      minFilter: null
    })
    return [scene, target]
  }, [])

  target.samples = 2

  useFrame((state) => {
    state.gl.setRenderTarget(target)

    state.gl.render(scene, camera.current)
    state.gl.setRenderTarget(null)
  })
  
  return { camera, scene, texture: target.texture}

}

function Scene() {
  const mat = useRef();

  useFrame(({ clock }) => {
    mat.current.uniforms.time.value = clock.getElapsedTime() / 6.
  });

  const scale = useAspect("cover", window.innerWidth, window.innerHeight, 1);

  return (
    <Plane scale={[...scale, 1]}>
      <sphereExampleMaterial 
        ref={mat} 
        resolution={[window.innerWidth, window.innerHeight]}
      />
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
        background: "#000",
      }}
      antialias={true}
      concurrent
      onCreated={({gl}) => {
        console.log(gl)
      }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
      <Stats />
    </Canvas>
  );
}
