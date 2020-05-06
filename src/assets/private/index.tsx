// Libs
import * as React from "react";
import * as ReactDom from "react-dom";
import App from "./containers/App/index";
import "./index.scss";
import GlobalProvider from "./store";

ReactDom.render(
  <GlobalProvider children={<App />} />,
  document.getElementById("wsps_react")
);

if (module.hot) {
  module.hot.accept();
}
