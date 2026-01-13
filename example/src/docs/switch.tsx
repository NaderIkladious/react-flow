import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";
import { DocsLayout } from "./layout";
import { Flow } from "@naderikladious/react-flow";

const SwitchDemo: React.FC = () => {
  const plans = ["starter", "pro", "enterprise"] as const;
  const [index, setIndex] = React.useState(0);
  const active = plans[index];

  return (
    <div className="card-surface p-4 shadow-card space-y-3">
      <Flow.Switch value={active}>
        <Flow.Case when="starter">
          <p className="text-slate-300">Starter plan — core analytics.</p>
        </Flow.Case>
        <Flow.Case when="pro">
          <p className="text-emerald-400 font-semibold">Pro plan — automation unlocked.</p>
        </Flow.Case>
        <Flow.Case when="enterprise">
          <p className="text-cyan-300 font-semibold">Enterprise — custom workflows.</p>
        </Flow.Case>
        <Flow.Default>
          <p className="text-slate-400">Unknown plan.</p>
        </Flow.Default>
      </Flow.Switch>
      <button className="button-ghost" onClick={() => setIndex((prev) => (prev + 1) % plans.length)}>
        Switch plan: {active}
      </button>
    </div>
  );
};

const sections = [
  {
    title: "Flow.Switch / Flow.Case / Flow.Default",
    description: "Declarative branching on a single value with optional predicates.",
    render: <SwitchDemo />,
    codeBlocks: [
      `return (
  <Flow.Switch value={plan}>
    <Flow.Case when="starter">
      <StarterBanner />
    </Flow.Case>
    <Flow.Case when="pro">
      <ProBanner />
    </Flow.Case>
    <Flow.Default>
      <DefaultBanner />
    </Flow.Default>
  </Flow.Switch>
);`,
      `return (
  <Flow.Switch value={role}>
    <Flow.Case when={(value) => value.startsWith("admin") }>
      <AdminPanel />
    </Flow.Case>
    <Flow.Default>
      <UserPanel />
    </Flow.Default>
  </Flow.Switch>
);`,
    ],
  },
  {
    title: "API",
    description: "Parameters and types.",
    apiRows: [
      {
        name: "value",
        type: "T",
        description: "Value to match.",
      },
      {
        name: "when",
        type: "T | (value: T) => boolean",
        description: "Match value or predicate.",
      },
      {
        name: "children",
        type: "ReactNode",
        description: "Content to render.",
      },
    ],
    codeBlocks: [
      `type FlowSwitchProps<T> = {\n  value: T;\n  children?: React.ReactNode;\n};\n\ntype FlowCaseProps<T> = {\n  when: T | ((value: T) => boolean);\n  children?: React.ReactNode;\n};\n\ntype FlowDefaultProps = {\n  children?: React.ReactNode;\n};`,
    ],
  },
];

const App: React.FC = () => (
  <DocsLayout
    title="React switch/case"
    subtitle="Flow.Switch, Flow.Case, Flow.Default"
    summary="Replace cascaded if/else blocks with composable cases."
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
