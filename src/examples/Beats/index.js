import * as THREE from "three";
import React, { Suspense } from "react";
import { OrbitControls, PerspectiveCamera, Plane } from "drei";
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
    BPM: { value: 60 },
    divisions: { value: 1, min: 1, max: 100, step: 1 },
    color: "#ff0191",
  },
  frag
);

function Scene() {
  const { color, ...props } = useTweaks("Tweaks", tweaks);

  return <ShaderPlane {...props} color={new THREE.Color(color)} duration={1} />;
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
      camera={{ position: [0, 0, 1] }}
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
