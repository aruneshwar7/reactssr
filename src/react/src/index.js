import React from "react";
import { renderToString } from "react-dom/server";
import App from "./app.jsx";

 function render(jsonString) {
    const props = JSON.parse(jsonString);
  console.log("Props in render:", props , typeof props);
  return renderToString(React.createElement(App,props));
}
globalThis.render = render;