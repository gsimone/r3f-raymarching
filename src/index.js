import React, { Suspense } from "react";
import { render } from "react-dom";
import { Canvas } from "react-three-fiber";
import { OrbitControls } from "drei";
import Scene from "./Scene";

render(
  <React.StrictMode>
    <Canvas
      shadowMap
      colorManagement
      camera={{ position: [0, 0, 2], far: 50 }}
      style={{
        background: "#121212",
      }}
      concurrent
    >
      <Scene />
    </Canvas>
  </React.StrictMode>,
  document.getElementById("root")
);
