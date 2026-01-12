# react-flow

Utilities for declarative control-flow primitives in React, written in TypeScript and packaged for ESM/CJS consumers.

## Motivation
- Keep conditional and iterative UI logic readable without custom hooks per component.
- Provide type-safe, render-prop based building blocks (`Flow.Condition`, `Flow.If`, `Flow.ForEach`, etc.).
- Ship tree-shakeable named exports for both bundlers and Node targets.

## Installation
```bash
npm install react-flow
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
Preferred namespace is `ReactFlow` (with `Flow` as a legacy alias).

- `ReactFlow.Condition` — provides a boolean value to descendants.
- `ReactFlow.If` — renders children when the condition is true (prop overrides context).
- `ReactFlow.Else` — renders children when the condition is false (prop overrides context).
- `ReactFlow.ForEach<T>` — iterates an array with an optional `keyExtractor` and render-function children `(item, index) => ReactNode`.
- `ReactFlow.For` — iterates `count` times with optional `start` and `step`, render-function children `(index) => ReactNode`.
- `ReactFlow.Batch<T>` — groups items into chunks of `batchSize` and renders `(batch, batchIndex) => ReactNode` using `ReactFlow.ForEach` under the hood.
- `ReactFlow.Switch` / `ReactFlow.Case` / `ReactFlow.Default` — declarative branching on a single value.
- `useFlowCondition` — hook to read the nearest `ReactFlow.Condition` value (throws if missing).

All components are also available as named exports (tree-shakeable) in addition to the namespace object.

## Examples
Basic conditionals:
```tsx
<ReactFlow.Condition value={isEnabled}>
  <ReactFlow.If>
    <div>Enabled</div>
  </ReactFlow.If>
  <ReactFlow.Else>
    <div>Disabled</div>
</ReactFlow.Else>
</ReactFlow.Condition>
```

Lists and batches:
```tsx
<ReactFlow.ForEach items={items} keyExtractor={(item) => item.id}>
  {(item) => <div>{item.name}</div>}
</ReactFlow.ForEach>

<ReactFlow.Batch items={products} batchSize={3}>
  {(batch, i) => (
    <section>
      <h3>Batch {i + 1}</h3>
      {batch.map((product) => (
        <div key={product.id}>{product.title}</div>
      ))}
    </section>
  )}
</ReactFlow.Batch>
```

Numeric loops:
```tsx
<ReactFlow.For count={5} start={1}>
  {(index) => <span key={index}>{index}</span>}
</ReactFlow.For>
```

## Scripts
- `npm run build` — bundle to `dist/` (CJS, ESM, and `.d.ts`).
- `npm run clean` — clear and recreate `dist/`.
- `npm run lint` — placeholder.

## Project structure
- `src/` — library source.
- `dist/` — build output (CJS, ESM, types).
- `example/` — Vite app consuming the local package via `file:..`.
