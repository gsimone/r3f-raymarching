import React, { Suspense } from "react";
import { shaderMaterial, Stats, useTextureLoader } from "drei";
import { Canvas, extend } from "react-three-fiber";

import ShaderPlane from "../../common/ShaderPlane";

import "styled-components/macro";

import frag from "./frag.glsl";
import vert from "../../common/defaultVertexShader.glsl";
import useCapture from "use-capture";
import { makeButton, useTweaks } from "use-tweaks";

function getValues(inputs) {
  return Object.entries(inputs).reduce((acc, [key, input]) => {
    let _val = input;

    if (input && typeof input === "object") {
      _val = input.value;
    }

    return { ...acc, [key]: _val };
  }, {});
}

function makeAll(data) {
  const material = shaderMaterial(
    {
      ...getValues(data),
      u_resolution: [0, 0],
      u_time: 0,
      u_mouse: [0, 0],
    },
    vert,
    frag
  );

  extend({ SphereExampleMaterial: material });

  return data;
}

const tweaks = makeAll({
  octaves: { value: 4, step: 1, min: 1, max: 8 },
  lacunarity: { value: 2, min: 0, max: 5 },
  gain: { value: 0.5, min: 0, max: 1 },
});

function Scene() {
  const props = useTweaks("Tweaks", tweaks);

  return <ShaderPlane {...props} duration={Math.PI * 2} />;
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
