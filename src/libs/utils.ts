import type { RefCallBack } from "react-hook-form";
import type { SelectOption } from "../types/input";

export const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export const getErrorMessage = (error: unknown): string => error instanceof Error ? error.message : String(error);

export const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** RHF's register() returns `ref`; MUI TextField needs it as `inputRef` to reach the real <input>. */
export const withInputRef = <T extends { ref: RefCallBack }>({ ref, ...rest }: T) => ({ ...rest, inputRef: ref });

export const toOptions =<K extends string>(labels: Record<K, string>): SelectOption<K>[] =>
  (Object.entries(labels) as [K, string][]).map(([value, label]) => ({ value, label }));
