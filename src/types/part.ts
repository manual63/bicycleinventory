import type { IsoDate } from "../libs/dates";

export type PartCategory = "suspension" | "drivetrain" | "brakes" | "wheels" | "cockpit" | "other";

export const partCategoryLabels: Record<PartCategory, string> = {
  suspension: "Suspension",
  drivetrain: "Drivetrain",
  brakes: "Brakes",
  wheels: "Wheels & Tires",
  cockpit: "Cockpit",
  other: "Other",
};

// Maintenance is either mileage-based (chain, fork) or calendar-based (tire sealant, brake bleed).
export type MaintenanceInterval =
  | { unit: "miles"; every: number }
  | { unit: "months"; every: number };

export type IntervalUnit = MaintenanceInterval["unit"];

type PartTypeInfo = {
  label: string;
  category: PartCategory;
  /** Pre-filled when adding a part of this type. Editable per part. */
  defaultInterval?: MaintenanceInterval;
  /** What the maintenance actually is, e.g. "Refresh sealant". */
  task?: string;
};

// Starting-point intervals: tune these from shop experience.
// `satisfies` checks every entry against PartTypeInfo while keeping the keys as literal types.
export const partTypes = {
  "fork": { label: "Fork", category: "suspension", defaultInterval: { unit: "miles", every: 500 }, task: "Lower leg service" },
  "rear-shock": { label: "Rear Shock", category: "suspension", defaultInterval: { unit: "miles", every: 500 }, task: "Air can service" },
  "chain": { label: "Chain", category: "drivetrain", defaultInterval: { unit: "miles", every: 1500 }, task: "Check wear / replace" },
  "cassette": { label: "Cassette", category: "drivetrain", defaultInterval: { unit: "miles", every: 5000 }, task: "Check wear" },
  "chainring": { label: "Chainring", category: "drivetrain" },
  "crankset": { label: "Crankset", category: "drivetrain" },
  "bottom-bracket": { label: "Bottom Bracket", category: "drivetrain", defaultInterval: { unit: "months", every: 12 }, task: "Inspect / service" },
  "derailleur": { label: "Rear Derailleur", category: "drivetrain" },
  "shifter": { label: "Shifter", category: "drivetrain" },
  "brake": { label: "Brake", category: "brakes", defaultInterval: { unit: "months", every: 12 }, task: "Bleed" },
  "brake-pads": { label: "Brake Pads", category: "brakes", defaultInterval: { unit: "miles", every: 500 }, task: "Inspect pads" },
  "rotor": { label: "Rotor", category: "brakes" },
  "wheel": { label: "Wheel", category: "wheels", defaultInterval: { unit: "months", every: 12 }, task: "True & hub service" },
  "tire": { label: "Tire", category: "wheels" },
  "tubeless-sealant": { label: "Tubeless Sealant", category: "wheels", defaultInterval: { unit: "months", every: 3 }, task: "Refresh sealant" },
  "handlebar": { label: "Handlebar", category: "cockpit" },
  "stem": { label: "Stem", category: "cockpit" },
  "grips": { label: "Grips", category: "cockpit" },
  "headset": { label: "Headset", category: "cockpit", defaultInterval: { unit: "months", every: 12 }, task: "Clean & grease" },
  "dropper-post": { label: "Dropper Post", category: "cockpit", defaultInterval: { unit: "months", every: 12 }, task: "Service" },
  "seatpost": { label: "Seatpost", category: "cockpit" },
  "saddle": { label: "Saddle", category: "cockpit" },
  "pedals": { label: "Pedals", category: "cockpit", defaultInterval: { unit: "months", every: 12 }, task: "Service bearings" },
  "other": { label: "Other", category: "other" },
} satisfies Record<string, PartTypeInfo>;

export type PartType = keyof typeof partTypes;

export const getPartTypeInfo = (type: PartType): PartTypeInfo => partTypes[type];

export type BikePart = {
  readonly id: string;
  type: PartType;
  brand: string;
  model: string;
  /** Free text: "120mm travel, 35mm clamp" */
  details?: string;
  installDate: IsoDate;
  /** Counts from installDate until the first service is logged. */
  lastServiced?: IsoDate;
  /** Undefined = nothing to track (e.g. handlebar). */
  interval?: MaintenanceInterval;
};

export type NewPart = Omit<BikePart, "id">;

export const partDisplayName = (part: Pick<BikePart, "brand" | "model" | "type">): string =>
  [part.brand, part.model].filter(Boolean).join(" ") || getPartTypeInfo(part.type).label;

export const formatInterval = (interval: MaintenanceInterval): string =>
  interval.unit === "miles"
    ? `Every ${interval.every.toLocaleString()} mi`
    : `Every ${interval.every} ${interval.every === 1 ? "month" : "months"}`;

export type Ride = {
  readonly id: string;
  date: IsoDate;
  miles: number;
  note?: string;
};

export type NewRide = Omit<Ride, "id">;
