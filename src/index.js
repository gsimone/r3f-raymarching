import React, { Suspense } from "react";
import { render } from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
} from "react-router-dom";
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

function Nav() {
  return (
    <ul css={`
      margin: 0;
      padding: 1rem;
      color: white;
    `}>
      <h3>Nav</h3>
      {Object.keys(examples).map((key) => {
        return (
          <li key={key} css={`
            list-style: none;
            a {
              color: white;
            }
          `}>
            <Link to={`/${key}`} key={key}>
              {key}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

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
        <div
          css={`
            display: flex;
            flex: 0 120px;
            display: none;
          `}
        >
          <Nav />
        </div>
        <div
          css={`
            flex: 1;
          `}
        >
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
      </div>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
