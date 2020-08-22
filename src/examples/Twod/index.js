import React, { Suspense } from "react";
import { shaderMaterial, Stats } from "drei";
import { Canvas, extend } from "react-three-fiber";

import ShaderPlane from "../../common/ShaderPlane";

import "styled-components/macro";

import frag from "./frag.glsl";
import vert from "../../common/defaultVertexShader.glsl";
import useCapture from "use-capture";
import { makeButton, useTweaks } from "use-tweaks";

const material = shaderMaterial(
  {
    radius: 1,
    density: 2,
    tiles: 1,
    u_resolution: [0, 0],
    u_time: 0,
    speed: 1,
  },
  vert,
  frag
);

function makeTweaksFromMaterial(material) {
  const mat = new material();
  const uniforms = mat.uniforms;

  const { u_time, u_resolution, ...interesting } = uniforms;

  return Object.entries(interesting).reduce((acc, [key, value]) => {
    return {
      [key]: { ...value, min: 0, max: value.value * 5 + 10 },
      ...acc,
    };
  }, {});
}

extend({ SphereExampleMaterial: material });

function Scene() {
  const tweaks = useTweaks("Tweaks", makeTweaksFromMaterial(material));

  return <ShaderPlane {...tweaks} duration={Math.PI * 2} />;
}

export default function CubeExample() {
  const [bind, start] = useCapture({ duration: Math.PI * 2, fps: 60 });
  useTweaks("Capture", makeButton("🔴 Start recording", start));

  return (
    <Canvas
      shadowMap
      colorManagement
      camera={{ position: [0, 0, 2], far: 50 }}
      style={{
        background: "#000",
      }}
      onCreated={bind}
      concurrent
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
      <Stats />
    </Canvas>
  );
}
