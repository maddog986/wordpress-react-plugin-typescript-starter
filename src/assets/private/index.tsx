// Libs
import * as React from "react";
import * as ReactDom from "react-dom";
import App from "./App";
import "./index.scss";

ReactDom.render(<App />, document.getElementById("wordpress_plugin_react"));

if (module.hot) {
  module.hot.accept();
}
