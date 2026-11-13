import { wait } from "../libs/utils";
import type { Bike, BikeChanges, NewBike } from "../types/bike";
import type { BikeRepository } from "./BikeRepository";

export class DelayedBikeRepository implements BikeRepository {
  private readonly inner: BikeRepository;
  private readonly delayedMs: number;

  constructor(inner: BikeRepository, delayedMs = 1200) {
    this.inner = inner;
    this.delayedMs = delayedMs;
  }

  async getAll(): Promise<Bike[]> {
    await wait(this.delayedMs);
    return this.inner.getAll();
  }

  async create(bike: NewBike): Promise<Bike> {
    await wait(this.delayedMs);
    return this.inner.create(bike);
  }

  async update(id: Bike["id"], changes: BikeChanges): Promise<Bike> {
    await wait(this.delayedMs);
    return this.inner.update(id, changes);
  }

  async delete(id: Bike["id"]): Promise<void> {
    await wait(this.delayedMs);
    return this.inner.delete(id);
  }
}
