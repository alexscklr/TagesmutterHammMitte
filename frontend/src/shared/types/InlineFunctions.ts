 export const InlineFunctions = {
  Age: "age",
  BouncyText: "bouncytext",
} as const; export interface InlineFunctionPayloads {
  [InlineFunctions.Age]: {
    date: string;
  };
  [InlineFunctions.BouncyText]: {
    amplitude?: number;
    duration?: number;
    pauseDuration?: number;
    characterDelay?: number;
    frequency?: number;
  };
} export type InlineFunctionType =
  typeof InlineFunctions[keyof typeof InlineFunctions]; export type InlineFunction<T extends InlineFunctionType = InlineFunctionType> = {
  type: T;
  value: InlineFunctionPayloads[T];
};

