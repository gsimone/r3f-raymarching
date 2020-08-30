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
  terrain: { title: "9. Terrain", _: lazy(() => import("./Terrain")) },
  beats: { title: "10. Beats", _: lazy(() => import("./Beats")) },
  feedback: { title: "11. Feedback", _: lazy(() => import("./Feedback")) },
  webcam: { title: "12. Webcam", _: lazy(() => import("./Webcam")) },
  feedbackInteraction: {
    title: "12. Feedback Interaction",
    _: lazy(() => import("./FeedbackInteraction")),
  },
  Voronoi: { title: "13. Voronoi", _: lazy(() => import("./Voronoi")) },
};

export default examples;
