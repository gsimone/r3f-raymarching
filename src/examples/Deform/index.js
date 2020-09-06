import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { Plane, useTextureLoader } from "drei";
import "styled-components/macro";

import { useTweaks } from "use-tweaks";

import frag from "./frag.glsl";
import uvImage from "./uv.png";
import makeAll from "../../common/makeAll";

const tweaks = makeAll(
  {
    scale: { value: 1, min: 0, max: 20 },
    intensity: { value: 0.1, min: 0, max: 10 },
  },
  frag,
  undefined,
  undefined,
  {
    samplerTxt: null,
    uvMap: null,
  }
);

function Scene() {
  const _tweaks = useTweaks("Tweaks", tweaks);
  const _mat = useRef();

  useFrame(({ clock, mouse }) => {
    _mat.current.uniforms.u_time.value = clock.getElapsedTime();
  });

  const samplerTxt = useTextureLoader(
    "https://source.unsplash.com/400x600/weekly?water"
  );
  const uvMap = useTextureLoader(uvImage);

  return (
    <Plane args={[4, 6]}>
      <sphereExampleMaterial
        ref={_mat}
        uvMap={uvMap}
        samplerTxt={samplerTxt}
        {..._tweaks}
      />
    </Plane>
  );
}

export default function CubeExample() {
  return (
    <Canvas colorManagement>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
