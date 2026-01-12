import React from "react";

type FlowConditionContextValue = {
  value: boolean;
  hasProvider: boolean;
};

const FlowConditionContext = React.createContext<FlowConditionContextValue>({
  value: false,
  hasProvider: false,
});

export type FlowConditionProps = {
  value: boolean;
  children?: React.ReactNode;
};

export const Condition: React.FC<FlowConditionProps> = ({ value, children }) => {
  return (
    <FlowConditionContext.Provider value={{ value, hasProvider: true }}>
      {children}
    </FlowConditionContext.Provider>
  );
};

export type FlowConditionalBranchProps = {
  condition?: boolean;
  children?: React.ReactNode;
};

const resolveCondition = (
  condition: boolean | undefined,
  context: FlowConditionContextValue,
  componentName: string
) => {
  if (typeof condition === "boolean") {
    return condition;
  }
  if (context.hasProvider) {
    return context.value;
  }
  throw new Error(`${componentName} requires a condition prop or Flow.Condition parent.`);
};

export const If: React.FC<FlowConditionalBranchProps> = ({ condition, children }) => {
  const context = React.useContext(FlowConditionContext);
  const active = resolveCondition(condition, context, "ReactFlow.If");
  return active ? <>{children}</> : null;
};

export const Else: React.FC<FlowConditionalBranchProps> = ({ condition, children }) => {
  const context = React.useContext(FlowConditionContext);
  const active = resolveCondition(condition, context, "ReactFlow.Else");
  return !active ? <>{children}</> : null;
};

export type FlowForEachProps<T> = {
  items: T[];
  keyExtractor?: (item: T, index: number) => React.Key;
  children: (item: T, index: number) => React.ReactNode;
};

export const ForEach = <T,>({ items, keyExtractor, children }: FlowForEachProps<T>): React.ReactElement => {
  return (
    <>
      {items.map((item, index) => (
        <React.Fragment key={keyExtractor ? keyExtractor(item, index) : index}>{children(item, index)}</React.Fragment>
      ))}
    </>
  );
};

export type FlowForProps = {
  count: number;
  start?: number;
  step?: number;
  children: (index: number) => React.ReactNode;
};

export const For: React.FC<FlowForProps> = ({ count, start = 0, step = 1, children }) => {
  if (!Number.isFinite(count) || count < 0) {
    console.warn("Flow.For received an invalid count; rendering nothing.");
    return null;
  }
  if (!Number.isFinite(step) || step === 0) {
    throw new Error("Flow.For requires a finite non-zero step.");
  }

  const iterations = Math.min(count, 10_000);
  const items = Array.from({ length: iterations }, (_, i) => start + i * step);

  if (iterations !== count) {
    // Guardrail against accidental infinite or huge loops.
    console.warn("Flow.For capped iterations at 10,000 to avoid infinite loops.");
  }

  return (
    <>
      {items.map((value, idx) => (
        <React.Fragment key={value}>{children(value)}</React.Fragment>
      ))}
    </>
  );
};

export type FlowBatchProps<T> = {
  items: T[];
  batchSize: number;
  children: (batch: T[], batchIndex: number) => React.ReactNode;
};

const chunkItems = <T,>(items: T[], batchSize: number): T[][] => {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
};

export const Batch = <T,>({ items, batchSize, children }: FlowBatchProps<T>): React.ReactElement => {
  if (!Number.isInteger(batchSize) || batchSize <= 0) {
    throw new Error("Flow.Batch requires a positive integer batchSize.");
  }

  const batches = chunkItems(items, batchSize);

  return (
    <ForEach
      items={batches}
      keyExtractor={(_, index) => index}
    >
      {(batch, batchIndex) => children(batch, batchIndex)}
    </ForEach>
  );
};

export type FlowSwitchProps<T> = {
  value: T;
  children?: React.ReactNode;
};

export type FlowCaseProps<T> = {
  when: T | ((value: T) => boolean);
  children?: React.ReactNode;
};

export type FlowDefaultProps = {
  children?: React.ReactNode;
};

export const Case = <T,>(_props: FlowCaseProps<T>): React.ReactElement | null => {
  throw new Error("ReactFlow.Case must be used within ReactFlow.Switch.");
};

export const Default: React.FC<FlowDefaultProps> = () => {
  throw new Error("ReactFlow.Default must be used within ReactFlow.Switch.");
};

export const Switch = <T,>({ value, children }: FlowSwitchProps<T>): React.ReactElement | null => {
  let match: React.ReactNode | null = null;
  let defaultElement: React.ReactElement<FlowDefaultProps> | null = null;

  React.Children.forEach(children, (child) => {
    if (match) {
      return;
    }
    if (!React.isValidElement(child)) {
      return;
    }

    if (child.type === Default) {
      if (!defaultElement) {
        defaultElement = child as React.ReactElement<FlowDefaultProps>;
      }
      return;
    }

    if (child.type === Case) {
      const props = child.props as FlowCaseProps<T>;
      const isMatch =
        typeof props.when === "function" ? props.when(value) : Object.is(props.when, value);
      if (isMatch) {
        match = props.children;
      }
    }
  });

  if (match !== null) {
    return <>{match}</>;
  }

  if (defaultElement) {
    return <>{defaultElement.props.children}</>;
  }

  return null;
};

export const useFlowCondition = () => {
  const context = React.useContext(FlowConditionContext);
  if (!context.hasProvider) {
    throw new Error("useFlowCondition must be used within a ReactFlow.Condition.");
  }
  return context.value;
};

export const ReactFlow = {
  Condition,
  If,
  Else,
  ForEach,
  For,
  Batch,
  Switch,
  Case,
  Default,
};

// Legacy alias
export const Flow = ReactFlow;

export type ReactFlowProps = {
  message?: string;
};

export const ReactFlowComponent: React.FC<ReactFlowProps> = ({ message = "Hello from react-flow" }) => {
  return <div>{message}</div>;
};

export default ReactFlowComponent;
