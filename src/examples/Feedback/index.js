import * as THREE from "three";
import React, { useRef, useMemo, useEffect } from "react";
import { shaderMaterial, useAspect, Plane } from "drei";
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

const tweaks = makeAll(
  { size: 0.4, number: { value: 4, min: 1, max: 24, step: 1 } },
  { bufferTexture: null }
);

function Scene() {
  const twix = useTweaks("Tweaks", tweaks);

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
    bufferMaterial.current.uniforms.u_time.value = clock.getElapsedTime();
  });

  const scale = useAspect("cover", window.innerWidth, window.innerHeight);

  return (
    <>
      {createPortal(
        <Plane scale={scale}>
          <bufferMaterial
            ref={bufferMaterial}
            u_resolution={u_resolution.current}
            {...twix}
          />
        </Plane>,
        bufferScene
      )}
      <Plane scale={scale}>
        <meshBasicMaterial ref={finalQuad} />
      </Plane>
    </>
  );
}

export default function CubeExample() {
  return (
    <Canvas colorManagement camera={{ position: [0, 0, 5], far: 50 }}>
      <color attach="background" args={["#000"]} />
      <Scene />
    </Canvas>
  );
}
