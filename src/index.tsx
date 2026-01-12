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

export type FlowAsyncConditionProps = {
  value: Promise<boolean> | (() => Promise<boolean>);
  pending?: React.ReactNode;
  error?: (error: unknown) => React.ReactNode;
  children?: React.ReactNode;
};

export const AsyncCondition: React.FC<FlowAsyncConditionProps> = ({
  value,
  pending = null,
  error,
  children,
}) => {
  const [state, setState] = React.useState<{
    status: "pending" | "resolved" | "rejected";
    value?: boolean;
    error?: unknown;
  }>({ status: "pending" });

  React.useEffect(() => {
    let active = true;
    const promise = typeof value === "function" ? value() : value;
    Promise.resolve(promise)
      .then((resolved) => {
        if (!active) return;
        setState({ status: "resolved", value: resolved });
      })
      .catch((err) => {
        if (!active) return;
        setState({ status: "rejected", error: err });
      });
    return () => {
      active = false;
    };
  }, [value]);

  if (state.status === "pending") {
    return <>{pending}</>;
  }

  if (state.status === "rejected") {
    if (error) {
      return <>{error(state.error)}</>;
    }
    throw state.error instanceof Error ? state.error : new Error("Flow.AsyncCondition failed.");
  }

  return (
    <FlowConditionContext.Provider value={{ value: state.value ?? false, hasProvider: true }}>
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
  const active = resolveCondition(condition, context, "Flow.If");
  return active ? <>{children}</> : null;
};

export const Else: React.FC<FlowConditionalBranchProps> = ({ condition, children }) => {
  const context = React.useContext(FlowConditionContext);
  const active = resolveCondition(condition, context, "Flow.Else");
  return !active ? <>{children}</> : null;
};

export const Unless: React.FC<FlowConditionalBranchProps> = ({ condition, children }) => {
  const context = React.useContext(FlowConditionContext);
  const active = resolveCondition(condition, context, "Flow.Unless");
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
  throw new Error("Flow.Case must be used within Flow.Switch.");
};

export const Default: React.FC<FlowDefaultProps> = () => {
  throw new Error("Flow.Default must be used within Flow.Switch.");
};

export const Switch = <T,>({ value, children }: FlowSwitchProps<T>): React.ReactElement | null => {
  let match: React.ReactNode | null = null;
  let defaultChildren: React.ReactNode | null = null;

  const isPredicate = (when: FlowCaseProps<T>["when"]): when is (value: T) => boolean =>
    typeof when === "function";
  const isCaseElement = (node: React.ReactNode): node is React.ReactElement<FlowCaseProps<T>> =>
    React.isValidElement(node) && node.type === Case;
  const isDefaultElement = (node: React.ReactNode): node is React.ReactElement<FlowDefaultProps> =>
    React.isValidElement(node) && node.type === Default;

  React.Children.forEach(children, (child) => {
    if (match) {
      return;
    }
    if (isDefaultElement(child)) {
      if (defaultChildren === null) {
        defaultChildren = child.props.children;
      }
      return;
    }

    if (isCaseElement(child)) {
      const { when, children: caseChildren } = child.props;
      const isMatch = isPredicate(when)
        ? (when as (value: T) => boolean)(value)
        : Object.is(when, value);
      if (isMatch) {
        match = caseChildren;
      }
    }
  });

  if (match !== null) {
    return <>{match}</>;
  }

  if (defaultChildren !== null) {
    return <>{defaultChildren}</>;
  }

  return null;
};

export const useFlowCondition = () => {
  const context = React.useContext(FlowConditionContext);
  if (!context.hasProvider) {
    throw new Error("useFlowCondition must be used within a Flow.Condition.");
  }
  return context.value;
};

export const ReactFlow = {
  Condition,
  AsyncCondition,
  If,
  Else,
  Unless,
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
