import React from "react";
import ReactDOM from "react-dom/client";
import { Flow } from "@naderikladious/react-flow";
import { ReactCompareSlider, ReactCompareSliderHandle } from "react-compare-slider";
import { Highlight, Language, themes } from "prism-react-renderer";
import "./index.css";
import NpmIcon from "./icons/NpmIcon";
import GithubIcon from "./icons/GithubIcon";
import FlowLogo from "./assets/flow-logo.png";
import { DocumentDuplicateIcon, HeartIcon } from "@heroicons/react/24/outline";

const comparisons = [
  {
    title: "Condition / If / Else",
    summary: "Replace scattered return branches with a single Flow tree.",
    before: `
function Dashboard({ user, flags }) {
  return (
    <>
      {!user && <Login />}
      {user && !flags.analytics && <Upgrade />}
      {user && flags.analytics && user.role !== "admin" && user.trialExpired && <Paywall />}
      {user &&
        flags.analytics &&
        (user.role === "admin" || !user.trialExpired) && <Analytics />}
    </>
  );
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
      <Flow.ForEach items={batch} keyExtractor={(user) => user.id}>
        {(user) => <UserRow user={user} />}
      </Flow.ForEach>
    </section>
  )}
</Flow.Batch>
`.trim(),
  },
  {
    title: "Switch / Case / Default",
    summary: "Replace cascaded if/else blocks with declarative cases.",
    before: `
function Banner({ plan }) {
  return (
    <>
      {plan === "starter" && <StarterBanner />}
      {plan === "pro" && <ProBanner />}
      {plan === "enterprise" && <EnterpriseBanner />}
      {!["starter", "pro", "enterprise"].includes(plan) && <DefaultBanner />}
    </>
  );
}
`.trim(),
    after: `
return (
  <Flow.Switch value={plan}>
    <Flow.Case when="starter">
      <StarterBanner />
    </Flow.Case>
    <Flow.Case when="pro">
      <ProBanner />
    </Flow.Case>
    <Flow.Case when="enterprise">
      <EnterpriseBanner />
    </Flow.Case>
    <Flow.Default>
      <DefaultBanner />
    </Flow.Default>
  </Flow.Switch>
);
`.trim(),
  },
  {
    title: "Unless",
    summary: "Flip conditions without wrapping them in !.",
    before: `
function Panel({ isReady }) {
  return (
    <>
      {!isReady && <LoadingState />}
      {isReady && <Content />}
    </>
  );
}
`.trim(),
    after: `
return (
  <Flow.Condition value={isReady}>
    <Flow.Unless>
      <LoadingState />
    </Flow.Unless>
    <Flow.If>
      <Content />
    </Flow.If>
  </Flow.Condition>
);
`.trim(),
  },
  {
    title: "Async condition",
    summary: "Wait for async checks without threading state everywhere.",
    before: `
function Gate({ check }) {
  const [ready, setReady] = React.useState(null);

  React.useEffect(() => {
    check().then(setReady);
  }, [check]);

  if (ready === null) return <LoadingState />;
  return ready ? <Content /> : <NoAccess />;
}
`.trim(),
    after: `
return (
  <Flow.AsyncCondition
    value={check}
    pending={<LoadingState />}
  >
    <Flow.If>
      <Content />
    </Flow.If>
    <Flow.Else>
      <NoAccess />
    </Flow.Else>
  </Flow.AsyncCondition>
);
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
const npmUrl = "https://www.npmjs.com/package/@naderikladious/react-flow";
const docsUrl = `${import.meta.env.BASE_URL}docs/conditional/`;
const sponsorUrl = "https://github.com/sponsors/NaderIkladious";

const App: React.FC = () => {
  const [isPro, setIsPro] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [sliderPosition, setSliderPosition] = React.useState(50);
  const plans = ["starter", "pro", "enterprise"] as const;
  const [planIndex, setPlanIndex] = React.useState(1);
  const activePlan = plans[planIndex];
  const [asyncSeed, setAsyncSeed] = React.useState(0);
  const asyncCheck = React.useMemo(
    () =>
      new Promise<boolean>((resolve) => {
        window.setTimeout(() => resolve(isPro), 900);
      }),
    [isPro, asyncSeed]
  );

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

  React.useEffect(() => {
    setSliderPosition(50);
    const steps = [10, 90, 50];
    const timers = steps.map((position, idx) =>
      window.setTimeout(() => setSliderPosition(position), (idx + 1) * 1000)
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [activeIndex]);

  return (
    <div className="max-w-6xl mx-auto px-5 py-12 space-y-8">
      <header className="grid md:grid-cols-[1.4fr,1fr] gap-6 items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-semibold text-slate-100">
            <img src={FlowLogo} alt="Flow logo" className="h-4 w-4 rounded-sm" />
            Declarative control-flow
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Turn messy JSX into readable React Flow tags.
            <br />
            <span className="text-2xl md:text-3xl">Drop the nested <code>if</code> / <code>map</code> spaghetti.</span>
          </h1>
          <p className="text-slate-300 max-w-2xl">
            React Flow components replace ad-hoc conditions and maps sprinkled through markup with
            structured, named primitives. Highlight every clause and keep keys and types close to
            the UI.
          </p>
          <div className="flex flex-wrap gap-3">
            <a className="button-primary" href="https://github.com/NaderIkladious/react-flow">
              <GithubIcon className="h-6 w-6 fill-white" />
              <span className="ml-2">GitHub</span>
            </a>
            <a className="button-ghost" href={npmUrl}>
              <NpmIcon className="w-8 h-8" />
              <span className="ml-2">npm package</span>
            </a>
            <a className="button-ghost" href={docsUrl}>
              Docs
            </a>
            <button className="button-ghost" type="button" onClick={copyInstallCommand}>
              <DocumentDuplicateIcon className="h-5 w-5" />
              <span className="ml-2">{copied ? "Copied!" : "Copy npm install"}</span>
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
            <h2 className="text-xl font-semibold text-white mt-1">
              Real-world snippets: manual vs Flow
            </h2>
            <p className="text-slate-400 max-w-2xl">
              Same UI, two ways. The Flow version keeps logic local, keyed, and typed without
              branching across files.
            </p>
          </div>
        
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-1/5 w-full">
            <div className="compare-list">
              {comparisons.map((section, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={section.title}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition ${
                      isActive
                        ? "border-cyan-400/60 bg-cyan-400/10 text-white shadow-card"
                        : "border-slate-700/60 bg-white/5 text-slate-200 hover:border-slate-500/60"
                    }`}
                  >
                    <div className="text-sm font-semibold">{section.title}</div>
                    <div className="text-xs text-slate-400 mt-1">{section.summary}</div>
                  </button>
                );
              })}
              <div className="compare-scroll-hint">
                <span className="compare-scroll-dot" />
                Scroll
              </div>
            </div>
          </div>
          <div className="md:w-4/5 w-full card-surface shadow-card p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="eyebrow">{comparisons[activeIndex].title}</p>
                <p className="text-slate-400 text-sm max-w-3xl">
                  {comparisons[activeIndex].summary}
                </p>
              </div>
              <div className="pill text-xs bg-white/5 text-slate-200">Drag to compare</div>
            </div>
            <ReactCompareSlider
              className="compare-slider"
              position={sliderPosition}
              onPositionChange={setSliderPosition}
              transition="0.65s ease"
              itemOne={
                <div className="compare-item">
                  <CodeSample
                    title={`${comparisons[activeIndex].title} — without React Flow`}
                    badge="Manual"
                    code={comparisons[activeIndex].before}
                    accent="manual"
                  />
                </div>
              }
              itemTwo={
                <div className="compare-item">
                  <CodeSample
                    title={`${comparisons[activeIndex].title} — with React Flow`}
                    badge="Flow"
                    code={comparisons[activeIndex].after}
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
              style={{ width: "100%", height: "420px", borderRadius: "6px" }}
            />
          </div>
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
              <Flow.Unless>
                <p className="text-slate-400">Upgrade to unlock automation</p>
              </Flow.Unless>
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

          <div className="demo-card">
            <div className="demo-title">Plan switch</div>
            <Flow.Switch value={activePlan}>
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
            <div className="controls">
              <button
                className="button-ghost"
                onClick={() => setPlanIndex((index) => (index + 1) % plans.length)}
              >
                Switch plan: {activePlan}
              </button>
            </div>
          </div>

          <div className="demo-card">
            <div className="demo-title">Async gate</div>
            <Flow.AsyncCondition
              value={asyncCheck}
              pending={<p className="text-slate-400">Checking access...</p>}
            >
              <Flow.If>
                <p className="text-emerald-400 font-semibold">Access granted</p>
              </Flow.If>
              <Flow.Else>
                <p className="text-slate-400">Access denied</p>
              </Flow.Else>
            </Flow.AsyncCondition>
            <div className="controls">
              <button className="button-ghost" onClick={() => setAsyncSeed((v) => v + 1)}>
                Recheck async
              </button>
            </div>
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
          <a
            className="button-ghost inline-flex items-center gap-2"
            href={sponsorUrl}
            target="_blank"
            rel="noreferrer"
          >
            <HeartIcon className="h-5 w-5 text-red-500" />
            <span>Become a sponsor</span>
          </a>
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
