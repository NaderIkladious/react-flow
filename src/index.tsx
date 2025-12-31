import React from "react";

export type ReactFlowProps = {
  message?: string;
};

export const ReactFlow: React.FC<ReactFlowProps> = ({ message = "Hello from react-flow" }) => {
  return <div>{message}</div>;
};

export default ReactFlow;
