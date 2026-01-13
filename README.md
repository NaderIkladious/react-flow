<h1>
  <img src="https://raw.githubusercontent.com/NaderIkladious/react-flow/main/assets/flow-logo.png" alt="Flow logo" width="64" style="vertical-align: middle; margin-right: 8px;" />
  react-flow
</h1>

Utilities for declarative control-flow primitives in React, written in TypeScript and packaged for ESM/CJS consumers.

<p>
  <a href="https://www.npmjs.com/package/@naderikladious/react-flow">
    <img alt="npm" src="https://img.shields.io/npm/v/@naderikladious/react-flow" />
  </a>
  <a href="https://www.npmjs.com/package/@naderikladious/react-flow">
    <img alt="npm downloads" src="https://img.shields.io/npm/dm/@naderikladious/react-flow" />
  </a>
  <a href="https://github.com/NaderIkladious/react-flow/actions/workflows/pages.yml">
    <img alt="pages" src="https://img.shields.io/github/actions/workflow/status/NaderIkladious/react-flow/pages.yml?label=pages" />
  </a>
  <a href="https://bundlephobia.com/package/@naderikladious/react-flow">
    <img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@naderikladious/react-flow" />
  </a>
  <a href="https://github.com/NaderIkladious/react-flow">
    <img alt="maintained" src="https://img.shields.io/maintenance/yes/2026" />
  </a>
  <a href="https://github.com/NaderIkladious/react-flow/issues">
    <img alt="issues" src="https://img.shields.io/github/issues/NaderIkladious/react-flow" />
  </a>
  <a href="https://github.com/NaderIkladious/react-flow/blob/main/LICENSE">
    <img alt="license" src="https://img.shields.io/github/license/NaderIkladious/react-flow" />
  </a>
</p>

## Motivation
- Keep conditional and iterative UI logic readable without custom hooks per component.
- Provide type-safe, render-prop based building blocks (`Flow.Condition`, `Flow.If`, `Flow.ForEach`, etc.).
- Ship tree-shakeable named exports for both bundlers and Node targets.

Demo preview (GIF):
<p>
  <img src="https://raw.githubusercontent.com/NaderIkladious/react-flow/main/assets/react-flow-demo.gif" alt="Flow demo preview" width="720" />
</p>

## Installation
```bash
npm install @naderikladious/react-flow
```

If working from this repo locally, install and build the library first:
```bash
npm install
npm run build
```

To explore the Vite example app:
```bash
cd example
npm install
npm run dev
# For GitHub Pages build: GITHUB_PAGES=true npm run build
```

## API
Preferred namespace is `Flow` (with `ReactFlow` available as an alias).

- `Flow.Condition` — provides a boolean value to descendants.
- `Flow.AsyncCondition` — resolves a boolean asynchronously and provides it to descendants.
- `Flow.If` — renders children when the condition is true (prop overrides context).
- `Flow.Else` — renders children when the condition is false (prop overrides context).
- `Flow.Unless` — renders children when the condition is false (prop overrides context).
- `Flow.ForEach<T>` — iterates an array with an optional `keyExtractor` and render-function children `(item, index) => ReactNode`.
- `Flow.For` — iterates `count` times with optional `start` and `step`, render-function children `(index) => ReactNode`.
- `Flow.Batch<T>` — groups items into chunks of `batchSize` and renders `(batch, batchIndex) => ReactNode` using `Flow.ForEach` under the hood.
- `Flow.Switch` / `Flow.Case` / `Flow.Default` — declarative branching on a single value.
- `useFlowCondition` — hook to read the nearest `Flow.Condition` value (throws if missing).

All components are also available as named exports (tree-shakeable) in addition to the namespace object.

## Examples
Basic conditionals:
```tsx
<Flow.Condition value={isEnabled}>
  <Flow.If>
    <div>Enabled</div>
  </Flow.If>
  <Flow.Else>
    <div>Disabled</div>
</Flow.Else>
</Flow.Condition>
```

Lists and batches:
```tsx
<Flow.ForEach items={items} keyExtractor={(item) => item.id}>
  {(item) => <div>{item.name}</div>}
</Flow.ForEach>

<Flow.Batch items={products} batchSize={3}>
  {(batch, i) => (
    <section>
      <h3>Batch {i + 1}</h3>
      {batch.map((product) => (
        <div key={product.id}>{product.title}</div>
      ))}
    </section>
  )}
</Flow.Batch>
```

Numeric loops:
```tsx
<Flow.For count={5} start={1}>
  {(index) => <span key={index}>{index}</span>}
</Flow.For>
```

## Scripts
- `npm run build` — bundle to `dist/` (CJS, ESM, and `.d.ts`).
- `npm run clean` — clear and recreate `dist/`.
- `npm run lint` — placeholder.

## Project structure
- `src/` — library source.
- `dist/` — build output (CJS, ESM, types).
- `example/` — Vite app consuming the local package via `file:..`.
