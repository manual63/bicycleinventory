import { getErrorMessage } from "../libs/utils";
import { useBikeRepository } from "../repositories/BikeRepositoryContext";
import { useBikeStore } from "../store/bikeStore";
import { useToastStore } from "../store/toastStore";
import type { Bike, BikeChanges, NewBike } from "../types/bike";

export function useBikeActions() {
  const showToast = useToastStore((s) => s.showToast);
  const repository = useBikeRepository();
  const bikeAdded = useBikeStore((s) => s.bikeAdded);
  const bikeUpdated = useBikeStore((s) => s.bikeUpdated);
  const bikeRemoved = useBikeStore((s) => s.bikeRemoved)

  const addBike = async (bike: NewBike) => {
    try {
      const saved = await repository.create(bike);
      bikeAdded(saved);
      showToast(`Bike ${bike.brand} ${bike.model} Added!`, "success");
    } catch (error) {
      showToast(`Could not add bike: ${getErrorMessage(error)}`, "error");
      throw error;
    }
  };

  const updateBike = async (id: Bike["id"], changes: BikeChanges) => {
    try {
      const updated = await repository.update(id, changes);
      bikeUpdated(updated);
      showToast(`Bike ${updated.brand} ${updated.model} Updated`, "success");
    } catch (error) {
      showToast(`Could not update bike: ${getErrorMessage(error)}`, "error");
      throw error;
    }
  }

  const removeBike = async (id: Bike["id"]) => {
    try {
      await repository.delete(id);
      bikeRemoved(id);
      showToast("Bike Removed", "success");
    } catch (error) {
      showToast(`Could not remove bike: ${getErrorMessage(error)}`, "error");
      throw error;
    }
  }

  return { addBike, updateBike, removeBike };
}
