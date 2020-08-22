import React, { Suspense } from "react";
import { shaderMaterial, Stats } from "drei";
import { Canvas, extend } from "react-three-fiber";

import ShaderPlane from "../../common/ShaderPlane";

import "styled-components/macro";

import frag from "./frag.glsl";
import vert from "../../common/defaultVertexShader.glsl";
import { useTweaks } from "use-tweaks";

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
  octaves: { value: 6, step: 1, min: 1, max: 8 },
  lacunarity: { value: 1.95, min: 0, max: 5 },
  gain: { value: 0.52, min: 0, max: 1 },
  tint: { value: 0.57, min: 0, max: Math.PI * 2 },
});

function Scene() {
  const props = useTweaks("Tweaks", tweaks);

  return <ShaderPlane {...props} duration={Math.PI * 2} />;
}

export default function CubeExample() {
  return (
    <Canvas
      shadowMap
      colorManagement
      gl={{
        preserveDrawingBuffer: true,
      }}
      camera={{ position: [0, 0, 2], far: 50 }}
      style={{
        background: "#000",
      }}
      concurrent
    >
      <color attach="background" args={["#000"]} />
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
      <Stats />
    </Canvas>
  );
}
