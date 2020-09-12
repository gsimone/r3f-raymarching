import * as THREE from "three";
import React, { Suspense, useEffect, useRef } from "react";
import {
  Plane,
  Sphere,
  useAspect,
  useTextureLoader,
  Text,
  OrbitControls,
  useGLTFLoader,
} from "drei";
import { Canvas, useFrame, useThree } from "react-three-fiber";

import "styled-components/macro";

import { useTweaks } from "use-tweaks";

import domaindist from "./textures/domaindist.png";
import grunge from "./textures/grunge.jpg";
import liquid from "./textures/liquid.jpg";
import perlin from "./textures/perlin.png";
import ridge from "./textures/ridge.png";
import ridge2 from "./textures/ridge2.png";
import worley from "./textures/worley.jpg";

import frag from "./frag.glsl";
import vert from "./vert.glsl";
import makeAll from "./makeAll";

const tweaks = makeAll(
  {
    noiseTexture: null,
    bodyTexture: null,
  },
  {
    mainColor: { value: "#000000" },
    noiseColor: { value: "#ff0050" },
    mainColorMix: { value: 1, min: 0, max: 1 },
    fresnelBias: { value: 0, min: 0, max: 1, step: 0.001 },
    fresnelPower: { value: 2.9, min: 0, max: 10 },
    fresnelScale: { value: 2.14, min: 0, max: 10 },
  },
  frag,
  {
    noiseTextureNumber: {
      value: 5,
      options: {
        domaindist: 0,
        grunge: 1,
        liquid: 2,
        perlin: 3,
        ridge: 4,
        ridge2: 5,
        worley: 6,
      },
    },
  },
  vert
);

const TEXTURES = [domaindist, grunge, liquid, perlin, ridge, ridge2, worley];

function Thingie(props) {
  const { noiseColor, mainColor, noiseTextureNumber = 0, ...ppp } = useTweaks(
    "Tweaks",
    tweaks
  );

  const textures = useTextureLoader(TEXTURES);
  const scale = useAspect("cover", window.innerWidth, window.innerHeight, 20);

  const matty = useRef();
  const { camera } = useThree();
  useFrame(({ clock }) => {
    matty.current.uniforms.u_time.value = clock.getElapsedTime() / 20;

    const c = camera.position;
    matty.current.uniforms.u_camera.value = c.toArray();
  });

  const { nodes, materials } = useGLTFLoader("/cost.glb", true);

  useEffect(() => {
    const t = textures[noiseTextureNumber];
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    matty.current.uniforms.noiseTexture.value = textures[noiseTextureNumber];
  }, [noiseTextureNumber, textures]);

  return (
    <group {...props}>
      <mesh
        material={materials.CardIconography_Mat}
        geometry={nodes.CostMarker_Base.geometry}
      />
      <Sphere args={[0.16, 64, 64]}>
        <sphereExampleMaterial
          dispose={null}
          ref={matty}
          noiseColor={new THREE.Color(noiseColor)}
          mainColor={new THREE.Color(mainColor)}
          transparent
          {...ppp}
        />
      </Sphere>

      <Text position={[0, 0, 0.1]} fontSize={0.16}>
        4<meshBasicMaterial depthTest={false}></meshBasicMaterial>
      </Text>

      <Plane scale={scale} material-color={"#222"} />
    </group>
  );
}

export default function CubeExample() {
  return (
    <Canvas
      shadowMap
      colorManagement
      gl={{
        preserveDrawingBuffer: true,
        antialias: false,
      }}
      camera={{
        position: [0, 0, 0.5],
      }}
    >
      <Suspense fallback={null}>
        <Thingie position-y={0.165} />
        <Thingie position-y={-0.165} />
      </Suspense>
      <OrbitControls />

      <ambientLight intensity={2} color={"#ffffff"} />

      <directionalLight
        castShadow
        position={[6.4, 3.6, 30]}
        intensity={0.5}
        color={"#ffffff"}
        shadow-bias={-0.001}
        shadow-camera-near={0.1}
        shadow-camera-far={35}
        shadow-camera-top={7.2}
        shadow-camera-left={-12.8}
        shadow-camera-right={12.8}
        shadow-camera-bottom={-7.2}
        shadow-mapSize-height={512}
        shadow-mapSize-width={512}
      />
    </Canvas>
  );
}
