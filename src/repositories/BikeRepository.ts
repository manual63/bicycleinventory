import type { Bike, BikeChanges, NewBike } from "../types/bike";

export interface BikeRepository {
  getAll(): Promise<Bike[]>;
  create(bike: NewBike): Promise<Bike>;
  update(id: Bike["id"], changes: BikeChanges): Promise<Bike>;
  delete(id: Bike["id"]): Promise<void>;
}