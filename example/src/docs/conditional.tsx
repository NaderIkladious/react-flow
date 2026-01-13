import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";
import { DocsLayout } from "./layout";
import { Flow } from "@naderikladious/react-flow";

const AsyncDemo: React.FC = () => {
  const [seed, setSeed] = React.useState(0);
  const [allowed, setAllowed] = React.useState(true);
  const check = React.useMemo(
    () =>
      new Promise<boolean>((resolve) => {
        window.setTimeout(() => resolve(allowed), 700);
      }),
    [allowed, seed]
  );

  return (
    <div className="card-surface p-4 shadow-card space-y-3">
      <Flow.AsyncCondition
        value={check}
        pending={<p className="text-slate-400">Checking access...</p>}
      >
        <Flow.If>
          <p className="text-emerald-400 font-semibold">Access granted</p>
        </Flow.If>
        <Flow.Else>
          <p className="text-slate-400">Access denied</p>
        </Flow.Else>
      </Flow.AsyncCondition>
      <div className="flex flex-wrap gap-2">
        <button className="button-ghost" onClick={() => setAllowed((prev) => !prev)}>
          Toggle: {allowed ? "Allowed" : "Denied"}
        </button>
        <button className="button-ghost" onClick={() => setSeed((prev) => prev + 1)}>
          Recheck
        </button>
      </div>
    </div>
  );
};

const sections = [
  {
    title: "Flow.Condition + Flow.If / Flow.Else",
    description: "Provide a boolean once and branch in JSX without inline && chains.",
    render: (
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="card-surface p-4 shadow-card">
          <div className="text-sm text-slate-400 mb-2">Feature gate</div>
          <Flow.Condition value={true}>
            <Flow.If>
              <p className="text-emerald-400 font-semibold">Enabled</p>
            </Flow.If>
            <Flow.Else>
              <p className="text-slate-400">Disabled</p>
            </Flow.Else>
          </Flow.Condition>
        </div>
        <div className="card-surface p-4 shadow-card">
          <div className="text-sm text-slate-400 mb-2">Inline override</div>
          <Flow.If condition={false}>
            <p className="text-emerald-400 font-semibold">Visible</p>
          </Flow.If>
          <Flow.Else condition={false}>
            <p className="text-slate-400">Hidden</p>
          </Flow.Else>
        </div>
      </div>
    ),
    codeBlocks: [
      `return (
  <Flow.Condition value={isEnabled}>
    <Flow.If>
      <EnabledState />
    </Flow.If>
    <Flow.Else>
      <UpgradeState />
    </Flow.Else>
  </Flow.Condition>
);`,
      `return (
  <Flow.Condition value={user && flags.analytics}>
    <Flow.If condition={user?.role === "admin" || !user?.trialExpired}>
      <Analytics />
    </Flow.If>
    <Flow.Else>
      <Paywall />
    </Flow.Else>
  </Flow.Condition>
);`,
    ],
  },
  {
    title: "Flow.Unless",
    description: "Invert a condition without wrapping it in !.",
    render: (
      <div className="card-surface p-4 shadow-card">
        <Flow.Unless condition={false}>
          <p className="text-emerald-400 font-semibold">Rendered by Unless</p>
        </Flow.Unless>
      </div>
    ),
    codeBlocks: [
      `return (
  <Flow.Unless condition={isReady}>
    <LoadingState />
  </Flow.Unless>
);`,
    ],
  },
  {
    title: "Flow.AsyncCondition",
    description: "Resolve a boolean asynchronously, with pending and error UI.",
    render: <AsyncDemo />,
    codeBlocks: [
      `return (
  <Flow.AsyncCondition
    value={checkAccess}
    pending={<LoadingState />}
    error={(err) => <ErrorState error={err} />}
  >
    <Flow.If>
      <Content />
    </Flow.If>
    <Flow.Else>
      <NoAccess />
    </Flow.Else>
  </Flow.AsyncCondition>
);`,
    ],
  },
  {
    title: "API",
    description: "Parameters and types.",
    apiRows: [
      {
        name: "value (Condition)",
        type: "boolean",
        description: "Condition value for Flow.Condition.",
      },
      {
        name: "condition",
        type: "boolean | undefined",
        description: "Optional override for Flow.If/Else/Unless.",
      },
      {
        name: "value (Async)",
        type: "Promise<boolean> | () => Promise<boolean>",
        description: "Async source used by Flow.AsyncCondition.",
      },
      {
        name: "pending",
        type: "ReactNode",
        description: "Fallback UI while resolving.",
      },
      {
        name: "error",
        type: "(error: unknown) => ReactNode",
        description: "Optional error UI.",
      },
    ],
    codeBlocks: [
      `type FlowConditionProps = {\n  value: boolean;\n  children?: React.ReactNode;\n};\n\ntype FlowConditionalBranchProps = {\n  condition?: boolean;\n  children?: React.ReactNode;\n};\n\ntype FlowAsyncConditionProps = {\n  value: Promise<boolean> | (() => Promise<boolean>);\n  pending?: React.ReactNode;\n  error?: (error: unknown) => React.ReactNode;\n  children?: React.ReactNode;\n};`,
    ],
  },
];

const App: React.FC = () => (
  <DocsLayout
    title="React if condition"
    subtitle="Flow.Condition, Flow.If, Flow.Else, Flow.Unless"
    summary="Use Flow to keep conditional rendering readable and typed, with async support baked in."
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
