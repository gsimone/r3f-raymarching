import * as THREE from "three";
import React, {Suspense, useMemo, useRef} from "react";
import { Box, Icosahedron, PerspectiveCamera, shaderMaterial, useCubeTextureLoader } from "drei";
import { Canvas, extend, createPortal, useFrame } from "react-three-fiber";

import "styled-components/macro";

import ShaderPlane from "../../common/ShaderPlane";

import useCapture from "use-capture";
import { makeButton, useTweaks } from "use-tweaks";

import frag from "./frag.glsl";
import vert from "../../common/defaultVertexShader.glsl";
import { Bloom, ChromaticAberration, EffectComposer, Noise } from "react-postprocessing";

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
  primary: { value: "#000" },
  secondary: { value: "#1c225f" },
  shades: { value: "#04ffbf" },
  edges: { value: "#807fff" },
});

function useRenderTargetTexture() {
  const camera = useRef();

  const [scene, target] = useMemo(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#000");
    const target = new THREE.WebGLMultisampleRenderTarget(1024, 1024, {
      format: THREE.RGBFormat,
      stencilBuffer: false,
    });
    return [scene, target];
  }, []);

  target.samples = 2;

  useFrame((state) => {
    state.gl.setRenderTarget(target);

    state.gl.render(scene, camera.current);
    state.gl.setRenderTarget(null);
  });

  return { camera, scene, texture: target.texture };
}

function Scene() {
  const { primary, shades, edges, secondary, ...props } = useTweaks(
    "Tweaks",
    tweaks
  );

  const { texture, scene, camera } = useRenderTargetTexture();
  const envMap = useCubeTextureLoader(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'], { path: 'textures/cube/' })

  return (
    <>

      {createPortal(<ShaderPlane
        {...props}
        secondary={new THREE.Color(secondary)}
        shades={new THREE.Color(shades)}
        primary={new THREE.Color(primary)}
        edges={new THREE.Color(edges)}
        duration={6}
      />, scene)}

      <PerspectiveCamera ref={camera} position={[0, 0, 1]} />

      <Icosahedron args={[2, 6]}>
        <meshPhysicalMaterial 
          // color="#222" 
          map={texture}
          displacementMap={texture} 
          displacementScale={0.7}
          roughness={0.7}
        />
      </Icosahedron>
    </>
  );
}

export default function CubeExample() {
  const [bind, start] = useCapture({ duration: Math.PI * 2, fps: 60 });
  useTweaks("Capture", makeButton("🔴 Start recording", start));
  
  return (
    <Canvas shadowMap colorManagement gl={{
      preserveDrawingBuffer: true
    }} onCreated={bind}
    >
      <color attach="background" args={["#fff"]} />
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
      <ambientLight />
      <directionalLight position={[1, 0, 0]} itensity={.1} />
      <EffectComposer>
        <ChromaticAberration />
        <Noise opacity={0.03} />
        <Bloom luminanceSmoothing={0.9} />
      </EffectComposer>
    </Canvas>
  );
}
