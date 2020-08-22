import React, { useRef, Suspense } from "react";
import { Plane, shaderMaterial, Stats, useAspect } from "drei";
import { Canvas, useFrame, extend } from "react-three-fiber";

import frag from "./frag.glsl";
import vert from "../../common/defaultVertexShader.glsl";

extend({
  SphereExampleMaterial: shaderMaterial(
    { u_resolution: [0, 0], u_time: 0, text: null },
    vert,
    frag
  ),
});

function Scene() {
  const mat = useRef();

  useFrame(({ clock }) => {
    mat.current.uniforms.u_time.value = clock.getElapsedTime();
  });

  const scale = useAspect("cover", window.innerWidth, window.innerHeight, 1);

  return (
    <Plane scale={[...scale, 1]}>
      <sphereExampleMaterial
        ref={mat}
        u_resolution={[window.innerWidth, window.innerHeight]}
      />
    </Plane>
  );
}

export default function CubeExample() {
  return (
    <Canvas
      shadowMap
      colorManagement
      camera={{ position: [0, 0, 2], far: 50 }}
      style={{
        background: "#000",
      }}
      concurrent
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
      <Stats />
    </Canvas>
  );
}
