import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";
import { DocsLayout } from "./layout";
import { Flow } from "@naderikladious/react-flow";

const products = [
  { id: "p1", name: "Edge API", price: "$29" },
  { id: "p2", name: "Data Cloud", price: "$49" },
  { id: "p3", name: "Observability", price: "$69" },
  { id: "p4", name: "Automation", price: "$39" },
];

const sections = [
  {
    title: "Flow.Batch",
    description: "Chunk arrays and render each batch without custom helpers.",
    render: (
      <Flow.Batch items={products} batchSize={2}>
        {(batch, index) => (
          <div key={index} className="card-surface p-4 shadow-card space-y-2">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Batch {index + 1}
            </div>
            <Flow.ForEach items={batch} keyExtractor={(product) => product.id}>
              {(product) => (
                <div className="flex items-center justify-between text-slate-200">
                  <span>{product.name}</span>
                  <span className="text-slate-400 text-sm">{product.price}</span>
                </div>
              )}
            </Flow.ForEach>
          </div>
        )}
      </Flow.Batch>
    ),
    codeBlocks: [
      `return (
  <Flow.Batch items={users} batchSize={2}>
    {(batch) => (
      <Flow.ForEach items={batch} keyExtractor={(user) => user.id}>
        {(user) => <UserRow user={user} />}
      </Flow.ForEach>
    )}
  </Flow.Batch>
);`,
      `return (
  <Flow.Batch items={products} batchSize={3}>
    {(batch, batchIndex) => (
      <section key={batchIndex}>
        {batch.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    )}
  </Flow.Batch>
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
        description: "Items to chunk.",
      },
      {
        name: "batchSize",
        type: "number",
        description: "Items per batch.",
      },
      {
        name: "children",
        type: "(batch: T[], batchIndex: number) => ReactNode",
        description: "Render function.",
      },
    ],
    codeBlocks: [
      `type FlowBatchProps<T> = {\n  items: T[];\n  batchSize: number;\n  children: (batch: T[], batchIndex: number) => React.ReactNode;\n};`,
    ],
  },
];

const App: React.FC = () => (
  <DocsLayout
    title="React batch rendering"
    subtitle="Flow.Batch"
    summary="Split arrays into chunks with predictable sizing and easy rendering."
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
