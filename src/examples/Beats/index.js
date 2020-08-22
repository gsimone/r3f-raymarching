import * as THREE from "three";
import React, { Suspense } from "react";
import { Canvas } from "react-three-fiber";

import "styled-components/macro";

import ShaderPlane from "../../common/ShaderPlane";
import makeAll from "../../common/makeAll";

import { useTweaks } from "use-tweaks";

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
    BPM: { value: 120 },
  },
  frag
);

function Scene() {
  const { color, ...props } = useTweaks("Tweaks", tweaks);

  return <ShaderPlane {...props} color={new THREE.Color(color)} duration={1} />;
}

export default function CubeExample() {
  return (
    <Canvas
      shadowMap
      colorManagement
      gl={{
        preserveDrawingBuffer: true,
      }}
      camera={{ position: [0, 0, 1] }}
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
