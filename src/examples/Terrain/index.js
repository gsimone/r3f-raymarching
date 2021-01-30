import * as THREE from "three";
import React, { Suspense } from "react";
import { OrbitControls, PerspectiveCamera, Plane } from "@react-three/drei";
import { Canvas, createPortal } from "react-three-fiber";

import "styled-components/macro";

import ShaderPlane from "../../common/ShaderPlane";
import makeAll from "../../common/makeAll";
import useRenderTargetTexture from "../../common/useRenderTargetTexture";

import useCapture from "use-capture";
import { makeButton, useTweaks } from "use-tweaks";

import frag from "./frag.glsl";

import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from "react-postprocessing";

const tweaks = makeAll(
  {
    offset: { value: { x: 0, y: 0 } },
    lacunarity: { value: 3.48, min: 0, max: 5 },
    gain: { value: 0, min: 0, max: 1 },
    multi: { value: 10, min: 0, max: 10 },
    mountainsColor: "#ff0191",
  },
  frag
);

function Scene() {
  const { mountainsColor, offset, polygons, ...props } = useTweaks("Tweaks", {
    ...tweaks,
    polygons: { value: 1000, min: 10, max: 2000 },
  });

  const { texture, scene, camera } = useRenderTargetTexture(1024, 512);

  return (
    <>
      {createPortal(
        <ShaderPlane
          {...props}
          mountainsColor={new THREE.Color(mountainsColor)}
          offset={[offset.x, offset.y]}
          duration={6}
        />,
        scene
      )}

      <PerspectiveCamera ref={camera} position={[0, 0, 1]} />

      <Plane args={[100, 40, polygons, polygons]} rotation-x={-Math.PI / 2}>
        <meshPhysicalMaterial
          // color="#222"
          map={texture}
          displacementMap={texture}
          displacementScale={10}
          roughness={0.7}
          transmission={0.9}
        />
      </Plane>

      <color attach="background" args={["#000"]} />

      <fog attach="fog" near={1} far={40} color="#000" />
    </>
  );
}

export default function CubeExample() {
  const [bind, start] = useCapture({ duration: Math.PI * 2, fps: 60 });
  useTweaks("Capture", makeButton("🔴 Start recording", start));

  return (
    <Canvas
      shadowMap
      colorManagement
      gl={{
        preserveDrawingBuffer: true,
      }}
      camera={{ position: [0, 10, 20] }}
      onCreated={bind}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
      <ambientLight />
      <directionalLight position={[1, 0, 0]} itensity={0.1} />
      <EffectComposer>
        <ChromaticAberration />
        <Noise opacity={0.03} />
        <Bloom luminanceSmoothing={0.9} />
        <Vignette />
      </EffectComposer>
      <OrbitControls />
    </Canvas>
  );
}
