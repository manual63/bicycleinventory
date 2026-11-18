import type { SelectOption } from "../types/input";

export const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export const getErrorMessage = (error: unknown): string => error instanceof Error ? error.message : String(error);

export const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const toOptions = <K extends string>(labels: Record<K, string>): SelectOption<K>[] =>
  (Object.entries(labels) as [K, string][]).map(([value, label]) => ({ value, label }));
