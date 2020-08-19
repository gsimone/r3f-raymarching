import React, { useRef, useEffect } from "react";
import { Plane, shaderMaterial, useAspect } from "drei";
import { Canvas, useFrame, extend } from "react-three-fiber";

import { Recorder, useCapture } from "use-capture";

import frag from "./frag.glsl";
import vert from "../../common/defaultVertexShader.glsl";

extend({ SphereExampleMaterial: shaderMaterial({ time: 0 }, vert, frag) });

function Scene() {
  const { getProgress, startRecording } = useCapture();

  useEffect(() => {
    const h = (e) => {
      if (e.key === "r") {
        startRecording();
      }
    };

    window.addEventListener("keydown", h);

    return () => {
      window.removeEventListener("keydown", h);
    };
  }, [startRecording]);

  const mat = useRef();
  useFrame(({ clock }) => {
    mat.current.uniforms.time.value = getProgress();
  });

  const scale = useAspect("cover", window.innerWidth, window.innerHeight, 1);
  const s = Math.min(...scale.slice(0, 2));

  return (
    <Plane scale={[s, s, 1]}>
      <sphereExampleMaterial ref={mat} />
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
        background: "#121212",
      }}
      concurrent
    >
      <Scene />
      <Recorder duration={4} framerate={30} />
    </Canvas>
  );
}
