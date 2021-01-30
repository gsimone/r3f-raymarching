import React, { useRef } from "react";
import { ScreenQuad, useAspect } from "@react-three/drei";
import { useBasicUniforms } from "ombra";

import mergeRefs from "merge-refs";

const ShaderPlane = React.forwardRef(function ShaderPlane(
  { duration, ...tweaks },
  ref
) {
  const scale = useAspect("cover", window.innerWidth, window.innerHeight, 1);
  const mat = useRef();

  useBasicUniforms(mat);

  return (
    <ScreenQuad scale={scale}>
      <sphereExampleMaterial ref={mergeRefs(ref, mat)} {...tweaks} />
    </ScreenQuad>
  );
});

export default ShaderPlane;
