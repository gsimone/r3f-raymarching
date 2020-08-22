import * as THREE from "three";
import React, { Suspense } from "react";
import { Octahedron, PerspectiveCamera } from "drei";
import { Canvas, createPortal } from "react-three-fiber";

import "styled-components/macro";

import useCapture from "use-capture";
import { makeButton, useTweaks } from "use-tweaks";

import frag from "./frag.glsl";
import makeAll from "../../common/makeAll";
import ShaderPlane from "../../common/ShaderPlane";
import useRenderTargetTexture from "../../common/useRenderTargetTexture";

import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from "react-postprocessing";

const tweaks = makeAll(
  {
    speed: { value: 0.1, min: 0, max: 5 },
    lacunarity: { value: 1.95, min: 0, max: 5 },
    gain: { value: 0.52, min: 0, max: 1 },
    background: { value: "#000" },
    primary: { value: "#000" },
    secondary: { value: "#1c225f" },
    shades: { value: "#04ffbf" },
    edges: { value: "#807fff" },
  },
  frag
);

function Scene() {
  const { background, primary, shades, edges, secondary, ...props } = useTweaks(
    "Tweaks",
    tweaks
  );

  const { texture, scene, camera } = useRenderTargetTexture(1024, 1024);

  return (
    <>
      {createPortal(
        <ShaderPlane
          {...props}
          secondary={new THREE.Color(secondary)}
          shades={new THREE.Color(shades)}
          primary={new THREE.Color(primary)}
          edges={new THREE.Color(edges)}
          duration={6}
        />,
        scene
      )}

      <PerspectiveCamera ref={camera} position={[0, 0, 1]} />

      <Octahedron args={[2, 6]}>
        <meshPhysicalMaterial
          // color="#222"
          map={texture}
          displacementMap={texture}
          displacementScale={0.7}
          roughness={0.7}
          transmission={0.9}
        />
      </Octahedron>

      <color attach="background" args={[background]} />
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
    </Canvas>
  );
}
