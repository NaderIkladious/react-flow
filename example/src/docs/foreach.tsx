import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";
import { DocsLayout } from "./layout";
import { Flow } from "@naderikladious/react-flow";

const items = [
  { id: "a1", name: "Alpha" },
  { id: "b2", name: "Beta" },
  { id: "g3", name: "Gamma" },
];

const sections = [
  {
    title: "Flow.ForEach",
    description: "Typed list rendering with stable keys and render-function children.",
    render: (
      <div className="card-surface p-4 shadow-card space-y-2">
        <Flow.ForEach items={items} keyExtractor={(item) => item.id}>
          {(item, index) => (
            <div className="flex items-center justify-between text-slate-200">
              <span className="font-semibold">{item.name}</span>
              <span className="text-slate-400 text-sm">#{index + 1}</span>
            </div>
          )}
        </Flow.ForEach>
      </div>
    ),
    codeBlocks: [
      `return (
  <Flow.ForEach items={items} keyExtractor={(item) => item.id}>
    {(item, index) => <ItemRow key={item.id} item={item} index={index} />}
  </Flow.ForEach>
);`,
      `return (
  <Flow.ForEach items={groups} keyExtractor={(group) => group.id}>
    {(group) => (
      <Flow.ForEach items={group.items} keyExtractor={(item) => item.sku}>
        {(item) => <ItemRow item={item} />}
      </Flow.ForEach>
    )}
  </Flow.ForEach>
);`,
    ],
  },
  {
    title: "API",
    description: "Parameters and types.",
    apiRows: [
      {
        name: "items",
        type: "T[]",
        description: "Items to render.",
      },
      {
        name: "keyExtractor",
        type: "(item: T, index: number) => React.Key",
        description: "Optional key generator.",
      },
      {
        name: "children",
        type: "(item: T, index: number) => ReactNode",
        description: "Render function.",
      },
    ],
    codeBlocks: [
      `type FlowForEachProps<T> = {\n  items: T[];\n  keyExtractor?: (item: T, index: number) => React.Key;\n  children: (item: T, index: number) => React.ReactNode;\n};`,
    ],
  },
];

const App: React.FC = () => (
  <DocsLayout
    title="React forEach"
    subtitle="Flow.ForEach"
    summary="Drop map chains and keep list rendering consistent with typed render props."
    sections={sections}
  />
);

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
