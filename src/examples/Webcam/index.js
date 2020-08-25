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
  {
    lacunarity: { value: 0.5, min: 0, max: 1 },
    gain: { value: 0.5, min: 0, max: 1 },
    size: 0.4,
    number: { value: 4, min: 1, max: 24, step: 1 },
  },
  { bufferTexture: null, videoTexture: null }
);

function Camera({ videoElement }) {
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      var constraints = {
        video: { width: 1280, height: 720, facingMode: "user" },
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
          // apply the stream to the video element used in the texture
          videoElement.current.srcObject = stream;
          videoElement.current.play();
        })
        .catch(function (error) {
          console.error("Unable to access the camera/webcam.", error);
        });
    } else {
      console.error("MediaDevices interface not available.");
    }
  }, [videoElement]);

  return null;
}

function Scene({ videoElement }) {
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

  const $videoTexture = useRef();

  return (
    <>
      {createPortal(
        <Plane scale={scale}>
          <bufferMaterial
            ref={bufferMaterial}
            u_resolution={u_resolution.current}
            videoTexture={$videoTexture.current}
            {...twix}
          />
        </Plane>,
        bufferScene
      )}
      <Plane scale={scale}>
        <meshBasicMaterial ref={finalQuad} />
      </Plane>
      <Plane scale={scale} visible={false}>
        <meshBasicMaterial>
          <videoTexture
            args={[videoElement.current]}
            ref={$videoTexture}
            attach="map"
          />
        </meshBasicMaterial>
      </Plane>
      <Camera videoElement={videoElement} />
    </>
  );
}

export default function CubeExample() {
  const $video = useRef();

  return (
    <>
      <Canvas colorManagement camera={{ position: [0, 0, 5], far: 50 }}>
        <color attach="background" args={["#000"]} />
        <Scene videoElement={$video} />
      </Canvas>
      <video ref={$video} style={{ display: "none" }} />
    </>
  );
}
