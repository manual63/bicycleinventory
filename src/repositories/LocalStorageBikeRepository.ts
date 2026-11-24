import type { Bike, BikeChanges, NewBike } from "../types/bike";
import type { BikePart } from "../types/part";
import type { BikeRepository } from "./BikeRepository";

/** Shape of parts saved before parts had types: { name, cost }. */
type LegacyPart = { name: string; cost?: number };

/** What may be sitting in localStorage: older records can lack newer fields. */
type StoredBike = Omit<Bike, "parts" | "rides"> & {
  parts?: (BikePart | LegacyPart)[];
  rides?: Bike["rides"];
};

const isLegacyPart = (part: BikePart | LegacyPart): part is LegacyPart => !("type" in part);

export class LocalStorageBikeRepository implements BikeRepository {
  private readonly storageKey = "bikes";

  private readAll(): Bike[] {
    const json = localStorage.getItem(this.storageKey);
    if (json === null) return [];
    const stored = JSON.parse(json) as StoredBike[];

    let migrated = false;
    const bikes = stored.map((bike): Bike => {
      const parts = (bike.parts ?? []).map((part): BikePart => {
        if (!isLegacyPart(part)) return part;
        // Old parts were { name, cost }. Keep the name as the model; cost was dropped.
        migrated = true;
        return {
          id: crypto.randomUUID(),
          type: "other",
          brand: "",
          model: part.name,
          installDate: bike.acquiredDate ?? `${bike.year}-01-01`,
        };
      });
      if (!bike.parts || !bike.rides) migrated = true;
      return { ...bike, parts, rides: bike.rides ?? [] };
    });

    // Persist the migration once, so generated part ids stay stable between reads.
    if (migrated) this.writeAll(bikes);
    return bikes;
  }

  private writeAll(bikes: Bike[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(bikes));
  }

  async getAll(): Promise<Bike[]> {
    const bikes = this.readAll();
    return bikes;
  }

  async create(bike: NewBike): Promise<Bike> {
    // Reads the current array
    const bikes = this.readAll();

    // Builds the full Bike: the incoming fields plus a new id
    const newBike: Bike = { ...bike, id: crypto.randomUUID() };

    // Writes the array back with the new bike added
    this.writeAll([...bikes, newBike]);

    // Returns the bike that was saved
    return newBike;
  }

  async update(id: Bike["id"], changes: BikeChanges): Promise<Bike> {
    // Reads the current array of bikes.
    const bikes = this.readAll();

    // Finds the bike that needs to be updated
    const bikeToUpdate = bikes.find((bike) => bike.id === id);

    // If no bike is found it throws an error.
    // This shouldn't happen because the bike being edited should be in the list of bikes.
    if (!bikeToUpdate) throw new Error(`Bike ${id} is not found!`);

    // Update the bike that was found with the new changes.
    const updatedBike = { ...bikeToUpdate, ...changes };

    // Runs through the list of bikes and update the bike that needs updating
    const updatedBikes = bikes.map((bike) => (bike.id === id ? updatedBike : bike));

    // Writes the array back with the updated bike.
    this.writeAll(updatedBikes);

    return updatedBike;
  }

  async delete(id: Bike["id"]): Promise<void> {
    // Reads the current array of bikes.
    const bikes = this.readAll();

    // Removes the bike from the list of bikes.
    const updatedBikes = bikes.filter((bike) => bike.id !== id);

    // Writes the array back with the bike removed from the list.
    this.writeAll(updatedBikes);
  }
}
