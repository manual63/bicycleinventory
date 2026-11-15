export type CasingType = "xc" | "trail" | "enduro" | "dh";
export type WheelSetup = "29" | "27.5" | "mullet";
export type RidingSurface = "dry" | "wet";

export type TirePressureInput = {
  riderWeight: number;      // lb, including gear (pack, water, armor)
  bikeWeight: number;       // lb
  casing: CasingType;
  wheelSetup: WheelSetup;
  frontTireWidth: number;   // inches, as printed on the sidewall
  rearTireWidth: number;    // inches
  rimWidth: number;         // inner rim width, mm
  tubeless: boolean;
  surface: RidingSurface;
};

export type WheelPressure = {
  front: number;  // psi
  rear: number;   // psi
};

export type TirePressureResult = {
  withoutInserts: WheelPressure;
  withInserts: WheelPressure | null;  // null when the setup can't run inserts (tubes)
  limitedToRange: boolean;            // true if any value hit the model's min/max
};

export const casingLabels: Record<CasingType, string> = {
  xc: "XC (light casing)",
  trail: "Trail (EXO-type)",
  enduro: "Enduro (EXO+ / reinforced)",
  dh: "DH (dual-ply)",
};

export const wheelSetupLabels: Record<WheelSetup, string> = {
  "29": "29\" front and rear",
  "27.5": "27.5\" front and rear",
  mullet: "Mullet (29\" front, 27.5\" rear)",
};

export const ridingSurfaceLabels: Record<RidingSurface, string> = {
  dry: "Dry",
  wet: "Wet / muddy",
};

export const defaultTirePressureInput: TirePressureInput = {
  riderWeight: 180,
  bikeWeight: 32,
  casing: "trail",
  wheelSetup: "29",
  frontTireWidth: 2.4,
  rearTireWidth: 2.4,
  rimWidth: 30,
  tubeless: true,
  surface: "dry",
};
