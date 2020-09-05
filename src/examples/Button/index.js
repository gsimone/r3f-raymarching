import * as THREE from "three";
import React, { Suspense, useRef } from "react";
import { Plane, Sphere, useAspect, useTextureLoader } from "drei";
import { Canvas, useFrame } from "react-three-fiber";

import "styled-components/macro";

import { useTweaks } from "use-tweaks";

import normalMap from "./normal.png";
import noiseMap from "./anotherone.png";
import liquidMap from "./liquid.jpg";

import frag from "./frag.glsl";
import vert from "./vert.glsl";
import makeAll from "./makeAll";

const tweaks = makeAll(
  {
    scratchesTexture: null,
    noiseTexture: null,
    liquidTexture: null,
  },
  {
    color: { value: "#ff4f73" },
    fresnelColor: { value: "#ff8e11" },
    fresnelNoiseMultiplier: { value: 30, min: 0, max: 100 },
    fresnelMultiplier: { value: 30, min: 0, max: 100 },
    fresnelExponent: { value: 3.37, min: 0, max: 5 },
    noiseFresnelExponent: { value: 3.37, min: 0, max: 5 },
    bodyColor: { value: "#ff4f73" },
    colorMultiplier: { value: 0.5, min: 0, max: 1 },
  },
  frag,
  undefined,
  vert
);

function Scene() {
  const {
    color,
    fresnelColor,
    bodyColor,
    scratchesTexture,
    ...ppp
  } = useTweaks("Tweaks", tweaks);

  const normal = useTextureLoader(normalMap);
  const noise = useTextureLoader(noiseMap);
  const liquid = useTextureLoader(liquidMap);
  const scale = useAspect("cover", window.innerWidth, window.innerHeight);

  const matty = useRef();
  useFrame(({ clock }) => {
    matty.current.uniforms.u_time.value = clock.getElapsedTime() / 20;
  });

  return (
    <>
      <Sphere args={[2, 64, 64]}>
        <sphereExampleMaterial
          ref={matty}
          normalMap={normal}
          fresnelColor={new THREE.Color(fresnelColor)}
          color={new THREE.Color(color)}
          bodyColor={new THREE.Color(bodyColor)}
          {...ppp}
        >
          <texture
            {...noise}
            attach="noiseTexture"
            wrapS={THREE.RepeatWrapping}
            wrapT={THREE.RepeatWrapping}
          />
          <texture
            {...liquid}
            attach="liquidTexture"
            wrapS={THREE.RepeatWrapping}
            wrapT={THREE.RepeatWrapping}
          />
        </sphereExampleMaterial>
      </Sphere>

      <Plane scale={scale} material-color={"#222"} />
    </>
  );
}

export default function CubeExample() {
  return (
    <Canvas
      shadowMap
      colorManagement
      gl={{
        preserveDrawingBuffer: true,
      }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
