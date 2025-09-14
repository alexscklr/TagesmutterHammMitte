

// alle verfügbaren Inline-Functions
export const InlineFunctions = {
  Age: "age",
  BouncyText: "bouncytext",
} as const;

// Payloads für Inline-Functions
export interface InlineFunctionPayloads {
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
}

// Union-Type aller InlineFunctions
export type InlineFunctionType =
  typeof InlineFunctions[keyof typeof InlineFunctions];

// einzelner Inline-Function-Eintrag
export type InlineFunction<T extends InlineFunctionType = InlineFunctionType> = {
  type: T;
  value: InlineFunctionPayloads[T];
};


export interface RichTextSpan {
    /** Content */
    text: string;

    /** Inline Functions */
    inlineFunction?: InlineFunction;

    /** Styles */
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    link?: string;
}

