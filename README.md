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
```

## API
- `Flow.Condition` — provides a boolean value to descendants.
- `Flow.If` — renders children when the condition is true (prop overrides context).
- `Flow.Else` — renders children when the condition is false (prop overrides context).
- `Flow.ForEach<T>` — iterates an array with an optional `keyExtractor` and render-function children `(item, index) => ReactNode`.
- `Flow.For` — iterates `count` times with optional `start` and `step`, render-function children `(index) => ReactNode`.
- `Flow.Batch<T>` — groups items into chunks of `batchSize` and renders `(batch, batchIndex) => ReactNode` using `Flow.ForEach` under the hood.
- `useFlowCondition` — hook to read the nearest `Flow.Condition` value (throws if missing).

All components are also available as named exports (tree-shakeable) in addition to the `Flow` namespace object.

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
