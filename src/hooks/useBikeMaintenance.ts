import { todayIso, type IsoDate } from "../libs/dates";
import type { Bike } from "../types/bike";
import { partDisplayName, type BikePart, type NewPart, type NewRide, type Ride } from "../types/part";
import { useBikeActions } from "./useBikeActions";

/**
 * Part + ride operations for one bike. Each one builds the next `parts`/`rides`
 * array and saves it through updateBike, so the repository stays the only writer.
 */
export const useBikeMaintenance = (bike: Bike) => {
  const { updateBike } = useBikeActions();

  const saveParts = (parts: BikePart[], message: string) => updateBike(bike.id, { parts }, message);
  const saveRides = (rides: Ride[], message: string) => updateBike(bike.id, { rides }, message);

  const addPart = (part: NewPart) =>
    saveParts([...bike.parts, { ...part, id: crypto.randomUUID() }], `${partDisplayName(part)} added`);

  const updatePart = (id: BikePart["id"], changes: Partial<NewPart>) =>
    saveParts(
      bike.parts.map((part) => (part.id === id ? { ...part, ...changes } : part)),
      "Component updated",
    );

  const removePart = (id: BikePart["id"]) =>
    saveParts(bike.parts.filter((part) => part.id !== id), "Component removed");

  const logService = (part: BikePart, date: IsoDate = todayIso()) =>
    saveParts(
      bike.parts.map((p) => (p.id === part.id ? { ...p, lastServiced: date } : p)),
      `Service logged for ${partDisplayName(part)}`,
    );

  const addRide = (ride: NewRide) =>
    saveRides([...bike.rides, { ...ride, id: crypto.randomUUID() }], `Logged ${ride.miles} mi`);

  const removeRide = (id: Ride["id"]) =>
    saveRides(bike.rides.filter((ride) => ride.id !== id), "Mileage entry removed");

  return { addPart, updatePart, removePart, logService, addRide, removeRide };
};
