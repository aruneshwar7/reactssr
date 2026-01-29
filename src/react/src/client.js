import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./app.jsx";

const el = document.getElementById("__INIT_DATA__");
const props = el ? JSON.parse(el.textContent) : {};
hydrateRoot(
  document.getElementById("root"),
  React.createElement(App, props)
);
