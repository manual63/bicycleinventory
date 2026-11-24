import type { IsoDate } from "../libs/dates";
import type { BikePart, Ride } from "./part";

export type BikeType ="gravel" | "mountain" | "commuter" | "dj" | "bmx";
export type FrameMaterial = "aluminum" | "carbon-fiber" | "steel" | "titanium";
export type SuspensionType = "full-suspension" | "hardtail" | "full-rigid";

export type Bike = {
  readonly id: string;
  brand: string;
  model: string;
  year: number;
  frameMaterial: FrameMaterial;
  suspension?: SuspensionType;
  type: BikeType;
  isElectric: boolean;
  serialNumber?: string;
  /** When the bike was bought or built. New parts default their install date to this. */
  acquiredDate?: IsoDate;
  parts: BikePart[];
  rides: Ride[];
}

export const bikeTypeLabels: Record<BikeType, string> = {
  gravel: "Gravel",
  mountain: "Mountain",
  commuter: "Commuter",
  dj: "Dirt Jump",
  bmx: "BMX",
};

export const frameMaterialLabels: Record<FrameMaterial, string> = {
  "aluminum": "Aluminum",
  "carbon-fiber": "Carbon Fiber",
  "steel": "Steel",
  "titanium": "Titanium",
};

export const suspensionTypeLabels: Record<SuspensionType, string> = {
  "full-suspension": "Full Suspension",
  "hardtail": "Hardtail",
  "full-rigid": "Full Rigid",
};

export type NewBike = Omit<Bike, "id">;

export type BikeChanges = Partial<NewBike>;

export const bikeBrands = [
  "Specialized",
  "Trek",
  "Giant",
  "Cannondale",
  "Santa Cruz",
  "Yeti",
  "Pivot",
  "Ibis",
  "Norco"
] as const;

export const toNewBike = ({ id, ...rest }: Bike): NewBike => rest;
