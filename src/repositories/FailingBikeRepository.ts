import type { Bike } from "../types/bike";
import { LocalStorageBikeRepository } from "./LocalStorageBikeRepository";

export class FailingBikeRepository extends LocalStorageBikeRepository {
  override async create(): Promise<Bike> {
    throw new Error("Simulated failure while saving");
  }

  override async update(): Promise<Bike> {
    throw new Error("Simulated failure while updating");
  }

  override async delete(): Promise<void> {
    throw new Error("Simulated failure while deleting");
  }
}
