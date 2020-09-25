import * as THREE from "three";
import React, { useRef, useMemo, useEffect } from "react";
import { shaderMaterial, useAspect, Plane, Box, PerspectiveCamera } from "drei";
import {
  Canvas,
  extend,
  useFrame,
  createPortal,
  useThree,
} from "react-three-fiber";

import "styled-components/macro";

import frag from "./frag.glsl";
import vert from "../../common/defaultVertexShader.glsl";
import useRenderTargetTexture from "../../common/useRenderTargetTexture";
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

function makeAll(data, uniformOnly = {}) {
  const material = shaderMaterial(
    {
      ...getValues(data),
      u_resolution: [0, 0],
      u_time: 0,
      u_mouse: [0, 0],
      ...uniformOnly,
    },
    vert,
    frag
  );

  extend({ BufferMaterial: material });

  return data;
}

function swap(a, b) {
  let t = a;
  a = b;
  b = t;
}

makeAll(
  {
    lacunarity: 0.5,
    gain: 1,
    size: 0.4,
    number: { value: 4, min: 1, max: 24, step: 1 },
  },
  {
    bufferTexture: null,
    testTexture: null,
  }
);

function Scene() {
  const bufferMaterial = useRef();

  const textureA = useRef(
    new THREE.WebGLMultisampleRenderTarget(
      window.innerWidth,
      window.innerHeight
    )
  );
  const textureB = useRef(
    new THREE.WebGLMultisampleRenderTarget(
      window.innerWidth,
      window.innerHeight
    )
  );

  const bufferScene = useMemo(() => new THREE.Scene(), []);

  const finalQuad = useRef();

  const u_resolution = useRef([0, 0]);

  const { viewport } = useThree();
  useEffect(() => {
    const { width, height, factor } = viewport();
    u_resolution.current = [width * factor, height * factor];
  });

  useFrame(({ gl, scene, camera }) => {
    gl.setRenderTarget(textureB.current);
    gl.render(bufferScene, camera);
    gl.setRenderTarget(null);

    swap(textureA.current, textureB.current);

    finalQuad.current.map = textureB.current.texture;
    bufferMaterial.current.uniforms.bufferTexture.value =
      textureB.current.texture;
  });

  useFrame(({ clock }) => {
    bufferMaterial.current.uniforms.u_time.value =
      (clock.getElapsedTime() / Math.PI) * 2;
  });

  const scale = useAspect("cover", window.innerWidth, window.innerHeight);

  const { texture, scene, camera } = useRenderTargetTexture(
    window.innerWidth,
    window.innerHeight,
    undefined
  );

  const $animate = useRef();

  useFrame(({ clock, mouse }) => {
    $animate.current.rotation.x = $animate.current.rotation.y = Math.sin(
      clock.getElapsedTime() * 4
    );
    $animate.current.rotation.z = Math.cos(clock.getElapsedTime() * 3.5);
    $animate.current.rotation.y = Math.cos(clock.getElapsedTime() * 9);
  });

  const { color } = useTweaks({ color: "#333" });

  return (
    <>
      <PerspectiveCamera ref={camera} position={[0, 0, 5]} />

      {createPortal(
        <Plane scale={scale}>
          <bufferMaterial
            ref={bufferMaterial}
            u_resolution={u_resolution.current}
            testTexture={texture}
          />
        </Plane>,
        bufferScene
      )}

      <Plane scale={scale}>
        <meshBasicMaterial ref={finalQuad} />
      </Plane>

      {createPortal(
        <>
          <ambientLight intensity={0.2} />
          <directionalLight position={[1, 0, 0]} />
          <Box args={[1, 1, 1]} ref={$animate}>
            <meshStandardMaterial color={color} />
          </Box>
        </>,
        scene
      )}
    </>
  );
}

export default function CubeExample() {
  return (
    <Canvas
      gl={{ preserveDrawingBuffer: true }}
      colorManagement
      camera={{ position: [0, 0, 5], far: 50 }}
    >
      <color attach="background" args={["#000"]} />
      <Scene />
    </Canvas>
  );
}
