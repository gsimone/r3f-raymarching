import { lazy } from "react";

const examples = {
  metaballs: { title: "0. Meta", _: lazy(() => import("./Metaballs")) },
  fbm: { title: "1. FBM", _: lazy(() => import("./FBM")) },
  displace: { title: "2. Displace", _: lazy(() => import("./Displace")) },
  terrain: { title: "3. Terrain", _: lazy(() => import("./Terrain")) },
  feedback: { title: "4. Feedback", _: lazy(() => import("./Feedback")) },
  Voronoi: { title: "5. Voronoi", _: lazy(() => import("./Voronoi")) },
  Fresnel: { title: "6. Fresnel", _: lazy(() => import("./Fresnel")) },
};

export default examples;
