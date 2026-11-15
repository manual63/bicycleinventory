import type { TirePressureInput, TirePressureResult, WheelPressure } from "../types/tirePressure";

/**
 * Every tunable number in the calculator lives here.
 *
 * The model is a rule of thumb, not physics: a base pressure from the weight on
 * each wheel, scaled for tire width, then nudged by setup and conditions.
 * Calibrated so a 185 lb rider on a 33 lb bike (2.5" front / 2.4" rear, enduro
 * casing, 30mm rims, tubeless, dry) lands near SRAM's 22 / 25 psi suggestion.
 * Adjust these to match what you see in the shop.
 */
export const pressureModel = {
  /** psi per lb of load on a wheel, for the reference tire. */
  psiPerLb: 0.23,
  /** Share of rider + bike weight on the front wheel. The rest is on the rear. */
  frontWeightShare: 0.48,

  /** Tire width (inches) the base numbers are tuned for. */
  referenceTireWidth: 2.4,
  /** How strongly width changes pressure. Higher = wide tires drop more psi. */
  widthExponent: 1.5,

  /** Inner rim width (mm) the base numbers are tuned for. */
  referenceRimWidth: 30,
  /** psi change per mm of rim width away from the reference. Wider rim = lower psi. */
  psiPerRimMm: -0.3,

  /** Stiffer casings support the tire better, so they can run lower. */
  casingAdjustment: { xc: 2, trail: 0, enduro: -1, dh: -2 },
  /** 27.5" wheels hold less air than 29", so they need slightly more. */
  smallWheelAdjustment: 0.5,
  /** Tubes need more pressure to avoid pinch flats. */
  tubeMultiplier: 1.15,
  /** Softer tires grip better in the wet. */
  surfaceAdjustment: { dry: 0, wet: -1 },
  /** Inserts protect the rim, so you can drop pressure. Inserts require tubeless. */
  insertAdjustment: { front: -2, rear: -3 },

  /** Never suggest below these (psi). Burps and rim strikes get likely. */
  minPsi: { withoutInserts: 15, withInserts: 12 },
  /** Never suggest above this (psi). */
  maxPsi: 40,
  /** Round results to this step (psi). */
  roundTo: 0.5,
} as const;

const PSI_TO_BAR = 0.0689476;

export const psiToBar = (psi: number) => psi * PSI_TO_BAR;

const roundToStep = (value: number, step: number) => Math.round(value / step) * step;

export function calculateTirePressure(input: TirePressureInput): TirePressureResult {
  const m = pressureModel;
  const systemWeight = input.riderWeight + input.bikeWeight;

  // Adjustments that apply to both wheels the same way.
  const sharedAdjustment =
    m.casingAdjustment[input.casing] +
    m.surfaceAdjustment[input.surface] +
    (input.rimWidth - m.referenceRimWidth) * m.psiPerRimMm;

  const basePressure = (weightShare: number, tireWidth: number, isSmallWheel: boolean) => {
    const load = systemWeight * weightShare;
    const widthFactor = (m.referenceTireWidth / tireWidth) ** m.widthExponent;

    let psi = m.psiPerLb * load * widthFactor + sharedAdjustment;
    if (isSmallWheel) psi += m.smallWheelAdjustment;
    if (!input.tubeless) psi *= m.tubeMultiplier;
    return psi;
  };

  const frontIsSmall = input.wheelSetup === "27.5";
  const rearIsSmall = input.wheelSetup === "27.5" || input.wheelSetup === "mullet";

  const raw: WheelPressure = {
    front: basePressure(m.frontWeightShare, input.frontTireWidth, frontIsSmall),
    rear: basePressure(1 - m.frontWeightShare, input.rearTireWidth, rearIsSmall),
  };

  let limitedToRange = false;

  const finalize = (psi: number, minPsi: number) => {
    const limited = Math.min(Math.max(psi, minPsi), m.maxPsi);
    if (limited !== psi) limitedToRange = true;
    return roundToStep(limited, m.roundTo);
  };

  const withoutInserts: WheelPressure = {
    front: finalize(raw.front, m.minPsi.withoutInserts),
    rear: finalize(raw.rear, m.minPsi.withoutInserts),
  };

  const withInserts: WheelPressure | null = input.tubeless
    ? {
      front: finalize(raw.front + m.insertAdjustment.front, m.minPsi.withInserts),
      rear: finalize(raw.rear + m.insertAdjustment.rear, m.minPsi.withInserts),
    }
    : null;

  return { withoutInserts, withInserts, limitedToRange };
}
