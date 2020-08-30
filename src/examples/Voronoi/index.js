import React from "react";
import { Canvas } from "react-three-fiber";

import "styled-components/macro";

import { useTweaks } from "use-tweaks";

import frag from "./frag.glsl";
import makeAll from "../../common/makeAll";
import ShaderPlane from "../../common/ShaderPlane";

const tweaks = makeAll(
  {
    divisions: { value: 10, min: 1, max: 20 },
    multi: { value: 1, min: 0, max: 10 },
    scale: { min: 0, max: 10, value: 4.07 },
  },
  frag
);

function Scene() {
  const props = useTweaks("Tweaks", tweaks);

  return <ShaderPlane {...props} duration={6} />;
}

export default function CubeExample() {
  return (
    <Canvas colorManagement>
      <Scene />
    </Canvas>
  );
}
