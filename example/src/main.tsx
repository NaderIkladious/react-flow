import React from "react";
import ReactDOM from "react-dom/client";
import { Flow } from "react-flow";
import {
  ReactCompareSlider,
  ReactCompareSliderHandle,
} from "react-compare-slider";
import { Highlight, Language, themes } from "prism-react-renderer";
import "./index.css";

const comparisons = [
  {
    title: "Condition / If / Else",
    summary: "Replace scattered return branches with a single Flow tree.",
    before: `
function Dashboard({ user, flags }) {
  if (!user) return <Login />;
  if (!flags.analytics) return <Upgrade />;
  if (user.role !== "admin" && user.trialExpired) {
    return <Paywall />;
  }
  return <Analytics />;
}
`.trim(),
    after: `
<Flow.Condition value={!!user && flags.analytics}>
  <Flow.If condition={user?.role === "admin" || !user?.trialExpired}>
    <Analytics />
  </Flow.If>
  <Flow.Else>
    <Paywall />
  </Flow.Else>
</Flow.Condition>
`.trim(),
  },
  {
    title: "ForEach",
    summary: "Stop nesting map calls and forgetting keys.",
    before: `
function Orders({ orders }) {
  return (
    <div>
      {orders.map((order) => (
        order.items.map((item) => (
          <LineItem key={item.sku} {...item} />
        ))
    ))}
  </div>
);
}
`.trim(),
    after: `
<Flow.ForEach items={orders} keyExtractor={(order) => order.id}>
  {(order) => (
    <Flow.ForEach items={order.items} keyExtractor={(item) => item.sku}>
      {(item) => <LineItem {...item} />}
    </Flow.ForEach>
  )}
</Flow.ForEach>
`.trim(),
  },
  {
    title: "For",
    summary: "Skip manual counters and remember keys automatically.",
    before: `
const list = [];
for (let i = 1; i <= 5; i++) {
  list.push(<span key={i}>{i}</span>);
}
return <div>{list}</div>;
`.trim(),
    after: `
<Flow.For count={5} start={1}>
  {(index) => <span key={index}>{index}</span>}
</Flow.For>
`.trim(),
  },
  {
    title: "Batch",
    summary: "Chunk arrays without hand-written helpers.",
    before: `
const batches = [];
for (let i = 0; i < users.length; i += 2) {
  batches.push(users.slice(i, i + 2));
}
return batches.map((batch, idx) => (
  <section key={idx}>
    {batch.map((user) => (
      <UserRow key={user.id} user={user} />
  ))}
</section>
));
`.trim(),
    after: `
<Flow.Batch items={users} batchSize={2}>
  {(batch, idx) => (
    <section key={idx}>
      {batch.map((user) => (
        <UserRow key={user.id} user={user} />
      ))}
    </section>
  )}
</Flow.Batch>
`.trim(),
  },
];

type User = {
  id: string;
  name: string;
  role: "Admin" | "Editor" | "Viewer";
  trialExpired?: boolean;
};

type Product = {
  id: string;
  name: string;
  price: string;
};

const users: User[] = [
  { id: "u1", name: "Alice Harper", role: "Admin" },
  { id: "u2", name: "Ben Ortiz", role: "Editor", trialExpired: true },
  { id: "u3", name: "Casey Lin", role: "Viewer" },
  { id: "u4", name: "Drew Patel", role: "Editor" },
  { id: "u5", name: "Emi Park", role: "Viewer", trialExpired: true },
];

const products: Product[] = [
  { id: "p1", name: "Edge API", price: "$29" },
  { id: "p2", name: "Data Cloud", price: "$49" },
  { id: "p3", name: "Observability", price: "$69" },
  { id: "p4", name: "Feature Flags", price: "$19" },
  { id: "p5", name: "Automation", price: "$39" },
  { id: "p6", name: "Payments", price: "$59" },
];

const installCmd = "npm i @naderikladious/react-flow";

type CodeSampleProps = {
  title: string;
  badge: string;
  code: string;
  accent?: "manual" | "flow";
};

const CodeSample: React.FC<CodeSampleProps> = ({ title, badge, code, accent }) => (
  <div className="code-pane">
    <div className="flex items-center justify-between mb-3">
      <span className="text-cyan-300 text-sm font-semibold">{title}</span>
      <span
        className={`pill text-xs ${
          accent === "flow" ? "bg-gradient-to-r from-cyan-400/30 to-blue-500/30" : "bg-white/5"
        }`}
      >
        {badge}
      </span>
    </div>
    <HighlightedCode code={code} />
  </div>
);

const HighlightedCode: React.FC<{ code: string; language?: Language }> = ({
  code,
  language = "tsx",
}) => (
  <Highlight code={code} language={language} theme={themes.nightOwl}>
    {({ className, style, tokens, getLineProps, getTokenProps }) => (
      <pre className={`code-block ${className}`} style={{ ...style, backgroundColor: "transparent" }}>
        {tokens.map((line, index) => (
          <div key={index} {...getLineProps({ line })} className="code-line">
            <span className="code-line-number">{index + 1}</span>
            <span className="code-line-content">
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </span>
          </div>
        ))}
      </pre>
    )}
  </Highlight>
);

const App: React.FC = () => {
  const [isPro, setIsPro] = React.useState(true);
  const [copied, setCopied] = React.useState(false);

  const copyInstallCommand = async () => {
    try {
      await navigator.clipboard.writeText(installCmd);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.warn("Clipboard copy failed", err);
      setCopied(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-5 py-12 space-y-8">
      <header className="grid md:grid-cols-[1.4fr,1fr] gap-6 items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-semibold text-slate-100">
            <span className="h-2 w-2 rounded-full bg-gradient-to-br from-cyan-300 to-blue-400" />
            Declarative control-flow
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Untangle nested conditions.
            <br />
            Ship flows you can reason about.
          </h1>
          <p className="text-slate-300 max-w-2xl">
            React Flow turns manual <code>if</code> trees and nested <code>map</code> calls into
            typed, composable primitives. See how the same UI reads with and without Flow.
          </p>
          <div className="flex flex-wrap gap-3">
            <a className="button-primary" href="https://github.com/NaderIkladious/react-flow">
              View on GitHub
            </a>
            <button className="button-ghost" type="button" onClick={copyInstallCommand}>
              {copied ? "Copied!" : "Copy npm install"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="pill">Type-safe</span>
            <span className="pill">Tree-shakeable</span>
            <span className="pill">JSX-first</span>
          </div>
        </div>
        <div className="card-surface p-6 shadow-card backdrop-blur border border-white/10 space-y-3">
          <div className="badge-glow mb-2">Quick hits</div>
          <ul className="list-disc list-inside text-slate-200 space-y-1">
            <li>Drop-in JSX primitives for conditions, loops, and batches.</li>
            <li>Render-function children keep types close to markup.</li>
            <li>Named exports stay tree-shakeable for smaller bundles.</li>
          </ul>
        </div>
      </header>

      <section className="card-surface p-6 shadow-card">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <div>
            <p className="eyebrow">Before vs after</p>
            <h2 className="text-xl font-semibold text-white mt-1">
              Real-world snippets: manual vs Flow
            </h2>
            <p className="text-slate-400 max-w-2xl">
              Same UI, two ways. The Flow version keeps logic local, keyed, and typed without
              branching across files.
            </p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={isPro}
              onChange={(e) => setIsPro(e.target.checked)}
            />
            <span className="slider" />
            <span className="switch-label">{isPro ? "Pro" : "Trial"}</span>
          </label>
        </div>
        <div className="space-y-5">
          {comparisons.map((section) => (
            <div key={section.title} className="card-surface shadow-card p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="eyebrow">{section.title}</p>
                  <p className="text-slate-400 text-sm max-w-3xl">{section.summary}</p>
                </div>
                <div className="pill text-xs bg-white/5 text-slate-200">Drag to compare</div>
              </div>
              <ReactCompareSlider
                className="compare-slider"
                itemOne={
                  <div className="compare-item">
                    <CodeSample
                      title={`${section.title} — without Flow`}
                      badge="Manual"
                      code={section.before}
                      accent="manual"
                    />
                  </div>
                }
                itemTwo={
                  <div className="compare-item">
                    <CodeSample
                      title={`${section.title} — with Flow`}
                      badge="Flow"
                      code={section.after}
                      accent="flow"
                    />
                  </div>
                }
                handle={
                  <ReactCompareSliderHandle
                    buttonStyle={{
                      border: "1px solid rgba(255,255,255,0.18)",
                      background: "#0d1428",
                      boxShadow: "0 10px 30px rgba(34, 211, 238, 0.25)",
                    }}
                    linesStyle={{
                      background:
                        "linear-gradient(180deg, rgba(34,211,238,0.5) 0%, rgba(59,130,246,0.6) 100%)",
                      width: "3px",
                    }}
                  />
                }
                style={{ width: "100%", height: "420px", borderRadius: "16px" }}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="card-surface p-6 shadow-card">
        <div className="mb-4">
          <p className="eyebrow">Live examples</p>
          <h2 className="text-xl font-semibold text-white mt-1">See the primitives in action</h2>
          <p className="text-slate-400 max-w-3xl">
            Toggle conditions, iterate with keys, and batch records without bespoke helpers. Everything
            below is driven by Flow components.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="demo-card">
            <div className="demo-title">Feature access</div>
            <Flow.Condition value={isPro}>
              <Flow.If>
                <p className="text-emerald-400 font-semibold">Pro features unlocked</p>
              </Flow.If>
              <Flow.Else>
                <p className="text-slate-400">Upgrade to unlock automation</p>
              </Flow.Else>
            </Flow.Condition>
            <div className="controls">
              <button className="button-ghost" onClick={() => setIsPro((v) => !v)}>
                Toggle: {isPro ? "Pro" : "Trial"}
              </button>
            </div>
          </div>

          <div className="demo-card">
            <div className="demo-title">Keyed lists</div>
            <Flow.ForEach items={users} keyExtractor={(user) => user.id}>
              {(user) => (
                <div className="flex gap-3 items-start border-b border-slate-700/40 py-2 last:border-0">
                  <span className="dot" aria-hidden />
                  <div>
                    <div className="font-semibold text-white">{user.name}</div>
                    <div className="text-slate-400">
                      {user.role} {user.trialExpired ? "• Trial expired" : ""}
                    </div>
                  </div>
                </div>
              )}
            </Flow.ForEach>
          </div>

          <div className="demo-card">
            <div className="demo-title">Batched products</div>
            <Flow.Batch items={products} batchSize={2}>
              {(batch, batchIndex) => (
                <div className="batch-card" key={`batch-${batchIndex}`}>
                  <div className="badge-glow mb-3">Batch {batchIndex + 1}</div>
                  <Flow.ForEach items={batch} keyExtractor={(product) => product.id}>
                    {(product) => (
                      <div className="pill text-slate-200">
                        {product.name} — {product.price}
                      </div>
                    )}
                  </Flow.ForEach>
                </div>
              )}
            </Flow.Batch>
          </div>
        </div>
      </section>

      <footer className="flex flex-wrap justify-between items-center gap-3 border-t border-slate-700/40 pt-6 text-slate-200">
        <div>
          <p className="eyebrow">Get started</p>
          <h3 className="text-xl font-semibold text-white mt-1">
            Install, import, and ship fewer condition bugs.
          </h3>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button className="button-primary" type="button" onClick={copyInstallCommand}>
            {copied ? "Copied!" : installCmd}
          </button>
          <a className="button-ghost" href="https://github.com/NaderIkladious/react-flow">
            Star on GitHub
          </a>
        </div>
      </footer>
    </div>
  );
};

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
