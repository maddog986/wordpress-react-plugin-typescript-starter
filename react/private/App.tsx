import React from "react";

const testImage = require("./assets/img/wp-logo.png");

const App = () => (
  <div>
    <h1>Hello from React!</h1>

    <img src={testImage} height={200} />
  </div>
);

export default App;
