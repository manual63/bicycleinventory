import { useBikeRepository } from "../repositories/BikeRepositoryContext";
import { useBikeStore } from "../store/bikeStore";
import type { Bike, BikeChanges, NewBike } from "../types/bike";

export function useBikeActions() {
  const repository = useBikeRepository();
  const bikeAdded = useBikeStore((s) => s.bikeAdded);
  const bikeUpdated = useBikeStore((s) => s.bikeUpdated);
  const bikeRemoved = useBikeStore((s) => s.bikeRemoved)

  const addBike = async (bike: NewBike) => {
    const saved = await repository.create(bike);
    bikeAdded(saved);
  };

  const updateBike = async (id: Bike["id"], changes: BikeChanges) => {
    const updated = await repository.update(id, changes);
    bikeUpdated(updated);
  }

  const removeBike = async (id: Bike["id"]) => {
    await repository.delete(id);
    bikeRemoved(id);
  }

  return { addBike, updateBike, removeBike };
}