import React from "react";
import ReactDOM from "react-dom/client";
import { ReactFlow } from "../dist";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<ReactFlow message="Example usage" />);
}
