import React, { Suspense } from "react";
import { shaderMaterial, Stats } from "drei";
import { Canvas, extend } from "react-three-fiber";

import ShaderPlane from "../../common/ShaderPlane";

import "styled-components/macro";

import frag from "./frag.glsl";
import vert from "../../common/defaultVertexShader.glsl";
import { useTweaks } from "use-tweaks";

const material = shaderMaterial(
  {
    gradientScale: 1,
    unionFactor: 0.25,
    lightness: 5,
    u_resolution: [0, 0],
    u_time: 0,
    u_mouse: [0, 0],
  },
  vert,
  frag
);

function makeTweaksFromMaterial(material) {
  const mat = new material();
  const uniforms = mat.uniforms;

  const { time, u_resolution, u_time, u_mouse, ...interesting } = uniforms;

  return interesting;
}

extend({ SphereExampleMaterial: material });

function Scene() {
  const tweaks = useTweaks("Tweaks", makeTweaksFromMaterial(material));

  return <ShaderPlane {...tweaks} duration={Math.PI * 2} />;
}

export default function CubeExample() {
  return (
    <div
      css={`
        width: 600px;
        height: 600px;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
      `}
    >
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
    </div>
  );
}
