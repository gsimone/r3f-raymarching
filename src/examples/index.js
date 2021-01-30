import { lazy } from "react";

const examples = {
  metaballs: { title: "4. Meta", _: lazy(() => import("./Metaballs")) },
  ghost: { title: "5. Ghost", _: lazy(() => import("./Ghost")) },
  fbm: { title: "7. FBM", _: lazy(() => import("./FBM")) },
  displace: { title: "8. Displace", _: lazy(() => import("./Displace")) },
  terrain: { title: "9. Terrain", _: lazy(() => import("./Terrain")) },
  feedback: { title: "11. Feedback", _: lazy(() => import("./Feedback")) },
  feedbackInteraction: {
    title: "12. Feedback Interaction",
    _: lazy(() => import("./FeedbackInteraction")),
  },
  Voronoi: { title: "13. Voronoi", _: lazy(() => import("./Voronoi")) },
  Button: { title: "14. Button", _: lazy(() => import("./Button")) },
  Deform: { title: "15. Deform", _: lazy(() => import("./Deform")) },
};

export default examples;
