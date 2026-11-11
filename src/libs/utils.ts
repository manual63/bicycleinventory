export const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export const getErrorMessage = (error: unknown): string => error instanceof Error ? error.message : String(error);
