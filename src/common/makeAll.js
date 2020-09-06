import { extend } from "react-three-fiber";
import { shaderMaterial } from "drei";

import vert from "./defaultVertexShader.glsl";

function getUniforms(inputs) {
  return Object.entries(inputs).reduce((acc, [key, input]) => {
    let _val = input;

    if (input && typeof input === "object") {
      _val = input.value;
    }

    return { ...acc, [key]: _val };
  }, {});
}

export default function makeAll(data, frag, tweaks, vertex, uniforms = {}) {
  const material = shaderMaterial(
    {
      ...getUniforms(data),
      u_resolution: [0, 0],
      u_time: 0,
      u_mouse: [0, 0],
      ...uniforms,
    },
    vertex || vert,
    frag
  );

  extend({ SphereExampleMaterial: material });

  return { ...data, ...tweaks };
}
