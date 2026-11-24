import type { BikePart, Ride } from "../types/part";
import { addDays, addMonths, daysBetween, todayIso, type IsoDate } from "./dates";

export type PartStatus = "overdue" | "due-soon" | "on-track" | "untracked";

export type PartHealth = {
  status: PartStatus;
  /** When maintenance is (or was) due. Null = no schedule, or not enough ride data to project one. */
  dueDate: IsoDate | null;
  /** True when the date is projected from riding pace rather than known. */
  estimated: boolean;
  /** 0–1 share of the interval used up, for the progress bar. */
  progress: number;
  /** "1 day overdue", "320 mi left", "Due in 7 days"... */
  summary: string;
};

export const maintenanceModel = {
  /** Anything due within this many days counts as "due soon". */
  dueSoonDays: 7,
  /** Mileage parts with this share (or less) of the interval left count as "due soon". */
  dueSoonMilesShare: 0.1,
  /** Riding pace is averaged over this many recent days. */
  paceWindowDays: 56,
} as const;

export const needsAttention = (status: PartStatus) => status === "overdue" || status === "due-soon";

/** Maintenance counts from the last service, or from install if it was never serviced. */
export const lastServiceDate = (part: BikePart): IsoDate => part.lastServiced ?? part.installDate;

const clamp01 = (n: number) => Math.min(Math.max(n, 0), 1);
const plural = (n: number, word: string) => `${n.toLocaleString()} ${word}${n === 1 ? "" : "s"}`;
const roundMiles = (n: number) => Math.round(n * 10) / 10;

/** Miles ridden between two dates, inclusive. */
export const milesBetween = (rides: Ride[], from: IsoDate, to: IsoDate): number =>
  rides.filter((ride) => ride.date >= from && ride.date <= to).reduce((sum, ride) => sum + ride.miles, 0);

export const totalMiles = (rides: Ride[]): number => rides.reduce((sum, ride) => sum + ride.miles, 0);

/** Average miles per day over the recent pace window. */
export const ridingPace = (rides: Ride[], today: IsoDate): number => {
  const { paceWindowDays } = maintenanceModel;
  return milesBetween(rides, addDays(today, -(paceWindowDays - 1)), today) / paceWindowDays;
};

export const getPartHealth = (part: BikePart, rides: Ride[], today: IsoDate = todayIso()): PartHealth => {
  const { interval } = part;
  if (!interval) {
    return { status: "untracked", dueDate: null, estimated: false, progress: 0, summary: "No maintenance schedule" };
  }
  const since = lastServiceDate(part);
  return interval.unit === "months"
    ? timeHealth(since, interval.every, today)
    : distanceHealth(since, interval.every, rides, today);
};

const statusFromDays = (daysLeft: number): PartStatus => {
  if (daysLeft < 0) return "overdue";
  if (daysLeft <= maintenanceModel.dueSoonDays) return "due-soon";
  return "on-track";
};

const describeDays = (daysLeft: number): string => {
  if (daysLeft < 0) return `${plural(-daysLeft, "day")} overdue`;
  if (daysLeft === 0) return "Due today";
  return `Due in ${plural(daysLeft, "day")}`;
};

const timeHealth = (since: IsoDate, months: number, today: IsoDate): PartHealth => {
  const dueDate = addMonths(since, months);
  const totalDays = Math.max(daysBetween(since, dueDate), 1);
  const daysLeft = daysBetween(today, dueDate);
  return {
    status: statusFromDays(daysLeft),
    dueDate,
    estimated: false,
    progress: clamp01((totalDays - daysLeft) / totalDays),
    summary: describeDays(daysLeft),
  };
};

/** The ride on which cumulative miles since `since` first reached `every`. */
const crossingDate = (rides: Ride[], since: IsoDate, every: number): IsoDate | null => {
  const sorted = rides.filter((ride) => ride.date >= since).toSorted((a, b) => a.date.localeCompare(b.date));
  let miles = 0;
  for (const ride of sorted) {
    miles += ride.miles;
    if (miles >= every) return ride.date;
  }
  return null;
};

const distanceHealth = (since: IsoDate, every: number, rides: Ride[], today: IsoDate): PartHealth => {
  const used = milesBetween(rides, since, today);
  const left = every - used;

  if (left <= 0) {
    return {
      status: "overdue",
      dueDate: crossingDate(rides, since, every) ?? today,
      estimated: false,
      progress: 1,
      summary: `${roundMiles(-left).toLocaleString()} mi over`,
    };
  }

  const pace = ridingPace(rides, today);
  const dueDate = pace > 0 ? addDays(today, Math.ceil(left / pace)) : null;
  const dueSoonByDate = dueDate !== null && daysBetween(today, dueDate) <= maintenanceModel.dueSoonDays;
  const dueSoonByMiles = left <= every * maintenanceModel.dueSoonMilesShare;

  return {
    status: dueSoonByDate || dueSoonByMiles ? "due-soon" : "on-track",
    dueDate,
    estimated: true,
    progress: clamp01(used / every),
    summary: `${roundMiles(left).toLocaleString()} mi left`,
  };
};

const statusOrder: Record<PartStatus, number> = { "overdue": 0, "due-soon": 1, "on-track": 2, "untracked": 3 };

/** Most urgent first; within a status, earliest due date first. */
export const compareHealth = (a: PartHealth, b: PartHealth): number =>
  statusOrder[a.status] - statusOrder[b.status] || (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999");

export type PartEntry = { part: BikePart; health: PartHealth };

/** Every part paired with its health, most urgent first. */
export const getPartEntries = (parts: BikePart[], rides: Ride[], today: IsoDate): PartEntry[] =>
  parts
    .map((part) => ({ part, health: getPartHealth(part, rides, today) }))
    .toSorted((a, b) => compareHealth(a.health, b.health));
