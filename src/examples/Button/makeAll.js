import { extend } from "react-three-fiber";
import { shaderMaterial } from "drei";

function getUniforms(inputs) {
  return Object.entries(inputs).reduce((acc, [key, input]) => {
    let _val = input;

    if (input && typeof input === "object") {
      _val = input.value;
    }

    return { ...acc, [key]: _val };
  }, {});
}

export default function makeAll(uniforms, data, frag, tweaks, vertex) {
  const material = shaderMaterial(
    {
      ...getUniforms(data),
      ...uniforms,
      u_resolution: [0, 0],
      u_time: 0,
      u_mouse: [0, 0],
      u_camera: [0, 0, 0],
    },
    vertex,
    frag
  );

  extend({ SphereExampleMaterial: material });

  return { ...data, ...tweaks };
}
