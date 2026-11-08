export type BikeType = "gravel" | "mountain" | "commuter" | "dj" | "bmx";
export type FrameMaterial = "aluminum" | "carbon-fiber" | "steel" | "titanium";

export type Bike = {
  readonly id: string;
  brand: string;
  model: string;
  year: number;
  frameMaterial: FrameMaterial;
  type: BikeType;
  isElectric: boolean;
  serialNumber?: string;
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
