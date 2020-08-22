import React, { useRef } from 'react'
import { Plane, useAspect } from "drei";
import { useFrame } from "react-three-fiber";

import mergeRefs from 'merge-refs'

const ShaderPlane = React.forwardRef(function ShaderPlane({ duration, ...tweaks }, ref) {
    
    const scale = useAspect("cover", window.innerWidth, window.innerHeight, 1);
    const mat = useRef()

    useFrame(({ clock }) => {
        mat.current.uniforms.time.value = clock.getElapsedTime() / duration;
    });
    
    return (
        <Plane scale={[...scale, 1]}>
            <sphereExampleMaterial
                ref={mergeRefs(ref, mat)}
                resolution={[window.innerWidth, window.innerHeight]}
                {...tweaks}
            />
        </Plane>
    )

})

export default ShaderPlane
