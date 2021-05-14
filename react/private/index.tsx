import React from "react";
import ReactDom from "react-dom";
import App from "./App";
import "./index.scss"; // import styles for private side

ReactDom.render(<App />, document.getElementById("wordpress_plugin_react"));

if (module.hot) {
  module.hot.accept();
}
