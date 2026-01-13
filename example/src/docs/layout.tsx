import React from "react";
import GithubIcon from "../icons/GithubIcon";
import NpmIcon from "../icons/NpmIcon";
import FlowLogo from "../assets/flow-logo.png";
import { Highlight, Language, themes } from "prism-react-renderer";

export type DocNavItem = {
  label: string;
  href: string;
};

export type DocSection = {
  title: string;
  description: string;
  codeBlocks: string[];
  apiRows?: Array<{ name: string; type: string; description: string }>;
  render?: React.ReactNode;
};

const repoUrl = "https://github.com/NaderIkladious/react-flow";
const npmUrl = "https://www.npmjs.com/package/@naderikladious/react-flow";
const base = import.meta.env.BASE_URL;

export const docNav: DocNavItem[] = [
  { label: "Conditional", href: `${base}docs/conditional/` },
  { label: "ForEach", href: `${base}docs/foreach/` },
  { label: "Switch", href: `${base}docs/switch/` },
  { label: "Batch", href: `${base}docs/batch/` },
];

export type DocsLayoutProps = {
  title: string;
  subtitle: string;
  summary: string;
  sections: DocSection[];
};

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

export const DocsLayout: React.FC<DocsLayoutProps> = ({ title, subtitle, summary, sections }) => {
  return (
    <div className="min-h-screen text-slate-100">
      <div className="max-w-6xl mx-auto px-5 py-12 space-y-6">
        <header className="card-surface p-6 shadow-card flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-cyan-300">
              <img src={FlowLogo} alt="Flow logo" className="h-5 w-5 rounded-sm" />
              Flow Docs
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{title}</h1>
            <p className="text-slate-300">{subtitle}</p>
            <p className="max-w-2xl text-slate-300">{summary}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a className="button-primary" href={repoUrl}>
              <GithubIcon className="h-5 w-5 fill-white" />
              <span className="ml-2">GitHub</span>
            </a>
            <a className="button-ghost" href={npmUrl}>
              <NpmIcon className="w-7 h-7" />
              <span className="ml-2">npm package</span>
            </a>
            <a className="button-ghost" href={`${base}`}>
              Back to demo
            </a>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-[220px,1fr]">
          <aside className="card-surface p-4 shadow-card sticky top-6 self-start flex flex-col gap-2">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Docs</div>
            {docNav.map((item) => (
              <a
                key={item.href}
                className="rounded-xl border border-slate-700/60 bg-white/5 px-4 py-2 text-slate-100 font-semibold hover:border-slate-500/60"
                href={item.href}
              >
                {item.label}
              </a>
            ))}
          </aside>

          <main className="flex flex-col gap-6">
            {sections.map((section) => (
              <section key={section.title} className="card-surface p-6 shadow-card">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                  <p className="text-slate-300 mt-1">{section.description}</p>
                </div>
                {section.render ? (
                  <div className="rounded-xl border border-slate-700/60 bg-midnight-800/70 p-4 mb-4">
                    {section.render}
                  </div>
                ) : null}
                {section.apiRows && section.apiRows.length > 0 ? (
                  <div className="rounded-xl border border-slate-700/60 bg-midnight-800/70 p-4 mb-4">
                    <div className="grid gap-3">
                      <div className="grid grid-cols-1 md:grid-cols-[140px,320px,0.85fr] gap-3 text-xs uppercase tracking-[0.18em] text-slate-400">
                        <span>Parameter</span>
                        <span>Type</span>
                        <span>Description</span>
                      </div>
                      {section.apiRows.map((row) => (
                        <div
                          key={row.name}
                          className="grid grid-cols-1 md:grid-cols-[140px,320px,0.85fr] gap-3 text-sm text-slate-200"
                        >
                          <span className="font-semibold text-slate-100">{row.name}</span>
                          <span className="inline-flex w-max items-center rounded-full bg-white/10 px-2 py-0.5 font-mono text-xs text-slate-100">
                            {row.type}
                          </span>
                          <span className="text-slate-400 text-xs">{row.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className="grid gap-3">
                  {section.codeBlocks.map((block) => (
                    <HighlightedCode key={block} code={block} />
                  ))}
                </div>
              </section>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
};
