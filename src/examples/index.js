import { lazy } from "react";

const examples = {
  cube: { title: "1. Cube", _: lazy(() => import("./Cube")) },
  mouse: { title: "2. Mouse Interaction", _: lazy(() => import("./Mouse")) },
  sphere: { title: "3. Sphere", _: lazy(() => import("./Sphere")) },
  octa: { title: "4. Octa", _: lazy(() => import("./Octa")) },
  metaballs: { title: "5. Meta", _: lazy(() => import("./Metaballs")) },
  ghost: { title: "6. Ghost", _: lazy(() => import("./Ghost")) },
  twod: { title: "7. Two Dimensions", _: lazy(() => import("./Twod")) },
};

export default examples;
