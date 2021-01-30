import * as THREE from "three";
import React from "react";
import { shaderMaterial } from "@react-three/drei";
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
  lacunarity: { value: 1.95, min: 0, max: 5 },
  gain: { value: 0.52, min: 0, max: 1 },
  primary: { value: "#ff44a6" },
  secondary: { value: "#58e8b4" },
  shades: { value: "#49ffb5" },
  edges: { value: "#5545ff" },
});

function Scene() {
  const { primary, shades, edges, secondary, ...props } = useTweaks(
    "Tweaks",
    tweaks
  );

  return (
    <ShaderPlane
      {...props}
      secondary={new THREE.Color(secondary)}
      shades={new THREE.Color(shades)}
      primary={new THREE.Color(primary)}
      edges={new THREE.Color(edges)}
      duration={6}
    />
  );
}

export default function CubeExample() {
  return (
    <Canvas colorManagement>
      <color attach="background" args={["#000"]} />
      <Scene />
    </Canvas>
  );
}
