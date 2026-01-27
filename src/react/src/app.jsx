import React from "react";

export default function App(props) {
  return <div>
    <h1>Hello React from GraalVM 👋</h1>
    <h1>Product: {props.productName}</h1>
        <p>{props.message}</p>
  </div>
}

