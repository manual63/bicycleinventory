import { createContext, use } from "react";
import type { BikeRepository } from "./BikeRepository";

export const BikeRepositoryContext = createContext<BikeRepository | null>(null);

export function useBikeRepository() {
  const repository = use(BikeRepositoryContext);
  if (!repository) throw new Error("useBikeRepository must be used inside a BikeRepositoryContext provider.")
  return repository;
}