// types.ts
export type Ingredient = {
  emertimi: string;
  pershkrimi?: string;
  sasia: number;
  njesia: string;
};

export type Receipt = {
  emertimi: string;
  ingredients: Ingredient[];
};

export type ProductRow = {
  emertimi: string;
  pershkrimi: string;
  sasia: string;
  njesia: string;
};
