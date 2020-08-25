import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame } from "react-three-fiber";

export default function useRenderTargetTexture(
  width,
  height,
  settings = {
    format: THREE.RGBAFormat,
    stencilBuffer: false,
    depthBuffer: false,
  },
  last
) {
  const camera = useRef();

  const [scene, target] = useMemo(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#000");
    const target = new THREE.WebGLRenderTarget(
      width,
      height,
      settings,
    );
    return [scene, target];
    // eslint-disable-next-line
  }, []);

  target.samples = 1;

  useFrame((state) => {
    state.gl.setRenderTarget(target);
    state.gl.render(scene, camera.current);
    state.gl.setRenderTarget(null);
  });

  return { camera, scene, texture: target.texture };
}
