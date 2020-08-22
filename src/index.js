import React, { Suspense } from "react";
import { render } from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { withRouter } from "react-router";
import { Helmet } from "react-helmet";
import "styled-components/macro";

import examples from "./examples";

function Loading() {
  return (
    <div
      css={`
        position: fixed;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        text-transform: uppercase;
      `}
    >
      Loading.
    </div>
  );
}

const Menu = withRouter(function Menu(props) {
  console.log();

  return (
    <select
      css={`
        position: fixed;
        bottom: 1rem;
        left: 1rem;
        z-index: 10;
      `}
      value={`${props.location.pathname.replace("/", "")}`}
      onChange={(e) => (window.location.href = e.target.value)}
    >
      {Object.keys(examples).map((key) => (
        <option key={key} value={key}>
          {examples[key].title}
        </option>
      ))}
    </select>
  );
});

render(
  <React.StrictMode>
    <Router>
      <div
        css={`
          height: 100%;
          display: flex;
          align-items: stretch;
        `}
      >
        <Menu />
        <Switch>
          {Object.keys(examples).map((key) => {
            const Example = examples[key]._;

            return (
              <Route key={key} path={`/${key}`}>
                <Helmet title={examples[key].title} />
                <Suspense fallback={<Loading />}>
                  <Example />
                </Suspense>
              </Route>
            );
          })}
          {/* redirect 404 to first example */}
          <Route children={<Redirect to={Object.keys(examples)[0]} />} />
        </Switch>
      </div>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
