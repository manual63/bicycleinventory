/**
 * Calendar dates stored as "YYYY-MM-DD" strings (what <input type="date"> produces).
 *
 * All math happens in UTC so daylight-saving shifts can never move a date by a day.
 * Plain strings also sort correctly with <, >, and localeCompare.
 */
export type IsoDate = string;

const DAY_MS = 86_400_000;

export const parseIsoDate = (iso: IsoDate): Date => {
  const [year = 1970, month = 1, day = 1] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

/** Expects a UTC-midnight Date like the ones parseIsoDate returns. */
export const toIsoDate = (date: Date): IsoDate => date.toISOString().slice(0, 10);

/** Today in the user's local time zone. */
export const todayIso = (): IsoDate => {
  const now = new Date();
  return toIsoDate(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())));
};

export const addDays = (iso: IsoDate, days: number): IsoDate => {
  const date = parseIsoDate(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return toIsoDate(date);
};

/** Jan 31 + 1 month = Feb 28/29 (clamped), not Mar 3. */
export const addMonths = (iso: IsoDate, months: number): IsoDate => {
  const date = parseIsoDate(iso);
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(day, lastDay));
  return toIsoDate(date);
};

/** Positive when `to` is after `from`. */
export const daysBetween = (from: IsoDate, to: IsoDate): number =>
  Math.round((parseIsoDate(to).getTime() - parseIsoDate(from).getTime()) / DAY_MS);

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export const formatDate = (iso: IsoDate): string => dateFormat.format(parseIsoDate(iso));
