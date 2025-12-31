import React from "react";
import ReactDOM from "react-dom/client";
import { Flow } from "react-flow";
import "./style.css";

const items = ["alpha", "beta", "gamma", "delta", "epsilon"];
const users = [
  { id: "u1", name: "Alice", role: "Admin" },
  { id: "u2", name: "Bob", role: "Editor" },
  { id: "u3", name: "Carol", role: "Viewer" },
  { id: "u4", name: "Dave", role: "Editor" },
  { id: "u5", name: "Eve", role: "Viewer" },
];

const App: React.FC = () => {
  return (
    <div className="app">
      <h1>react-flow example</h1>

      <section>
        <h2>Flow.Condition / Flow.If / Flow.Else</h2>
        <Flow.Condition value={true}>
          <Flow.If>
            <p>Condition is true</p>
          </Flow.If>
          <Flow.Else>
            <p>Condition is false</p>
          </Flow.Else>
        </Flow.Condition>
      </section>

      <section>
        <h2>Flow.For</h2>
        <div className="row">
          <Flow.For count={5} start={1}>
            {(value) => <span className="pill">{value}</span>}
          </Flow.For>
        </div>
      </section>

      <section>
        <h2>Flow.ForEach</h2>
        <Flow.ForEach items={items} keyExtractor={(item) => item}>
          {(item, index) => (
            <div className="card">
              <strong>{index + 1}.</strong> {item}
            </div>
          )}
        </Flow.ForEach>
      </section>

      <section>
        <h2>Flow.Batch (users)</h2>
        <Flow.Batch items={users} batchSize={2}>
          {(batch, batchIndex) => (
            <div className="batch" key={`batch-${batchIndex}`}>
              <h3>Batch {batchIndex + 1}</h3>
              <ul>
                {batch.map((user) => (
                  <li key={user.id}>
                    {user.name} — {user.role}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Flow.Batch>
      </section>
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
