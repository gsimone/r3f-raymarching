import React, { useRef, useEffect } from "react";
import { Plane, useAspect } from "drei";
import { useFrame, useThree } from "react-three-fiber";

import mergeRefs from "merge-refs";

const ShaderPlane = React.forwardRef(function ShaderPlane(
  { duration, ...tweaks },
  ref
) {
  const scale = useAspect("cover", window.innerWidth, window.innerHeight, 1);
  const mat = useRef();

  const u_resolution = useRef([0, 0]);

  const { viewport } = useThree();
  useEffect(() => {
    const { width, height, factor } = viewport();
    u_resolution.current = [width * factor, height * factor];
  });

  useFrame(({ clock, mouse }) => {
    mat.current.uniforms.u_time.value = clock.getElapsedTime() / duration;
    mat.current.uniforms.u_mouse.value = [mouse.x, mouse.y];
  });

  return (
    <Plane scale={[...scale, 1]}>
      <sphereExampleMaterial
        ref={mergeRefs(ref, mat)}
        u_resolution={u_resolution.current}
        {...tweaks}
      />
    </Plane>
  );
});

export default ShaderPlane;
