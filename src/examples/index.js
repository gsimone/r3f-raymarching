import { lazy } from "react";

const examples = {
  cube: { title: "1. Cube", _: lazy(() => import("./Cube")) },
  sphere: { title: "2. Sphere", _: lazy(() => import("./Sphere")) },
  octa: { title: "3. Octa", _: lazy(() => import("./Octa")) },
  metaballs: { title: "4. Meta", _: lazy(() => import("./Metaballs")) },
  ghost: { title: "5. Ghost", _: lazy(() => import("./Ghost")) },
  twod: { title: "6. Two Dimensions", _: lazy(() => import("./Twod")) },
  fbm: { title: "7. FBM", _: lazy(() => import("./FBM")) },
  displace: { title: "8. Displace", _: lazy(() => import("./Displace")) },
};

export default examples;
