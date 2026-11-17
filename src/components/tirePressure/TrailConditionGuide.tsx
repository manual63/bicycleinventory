import { Alert, Box, Chip, Divider, Stack, Typography } from "@mui/material";

type TrailConditionTip = {
  condition: string;
  direction: "lower" | "higher" | "same";
  adjustment: string;
  reason: string;
  note?: string;  // optional callout shown under the reason
};

const trailConditionTips: TrailConditionTip[] = [
  {
    condition: "Hardpack / smooth and fast",
    direction: "higher",
    adjustment: "+1–2 psi",
    reason: "Less rolling resistance and a crisper feel in berms. Grip is already good.",
  },
  {
    condition: "Loose over hard",
    direction: "lower",
    adjustment: "−1–2 psi",
    reason: "A bigger contact patch helps the knobs find grip through the marbles.",
  },
  {
    condition: "Loose, dusty, or deep loam",
    direction: "lower",
    adjustment: "−1–2 psi",
    reason: "A softer tire digs in and tracks better instead of skating on top.",
  },
  {
    condition: "Rocky and chunky",
    direction: "higher",
    adjustment: "+1–3 psi",
    reason: "Protects the rim and prevents pinch flats. Add more to the rear, or run inserts and stay closer to baseline.",
  },
  {
    condition: "Roots and wet rock",
    direction: "lower",
    adjustment: "−1–2 psi",
    reason: "A supple tire wraps over slick roots and rock instead of deflecting off them.",
  },
  {
    condition: "Mud and wet",
    direction: "lower",
    adjustment: "−1–2 psi",
    reason: "More bite in soft ground. The Wet setting above already takes off 1 psi, so don't double up.",
    note: "Respect trail rules about riding in wet conditions.",
  },
  {
    condition: "Bike park, big jumps, high speed",
    direction: "higher",
    adjustment: "+3–5 psi",
    reason: "Hard landings and high-speed compressions need support. The rear takes the biggest hits.",
  },
  {
    condition: "Cold mornings",
    direction: "same",
    adjustment: "Set at the trailhead",
    reason: "Pressure drops about 1 psi for every 10°F colder. Check it outside, not in a warm garage.",
  },
];

const directionColor = {
  lower: "info",
  higher: "warning",
  same: "default",
} as const;

export const TrailConditionGuide = () => (
  <Box>
    <Typography variant="subtitle2" gutterBottom>Adjusting for trail conditions</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
      General adjustments from the numbers above. Start small and change one thing at a time.
    </Typography>
    <Stack divider={<Divider flexItem />} spacing={1.5}>
      {trailConditionTips.map((tip) => (
        <Stack
          key={tip.condition}
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 0.5, sm: 2 }}
          sx={{ alignItems: { sm: "flex-start" } }}
        >
          <Box sx={{ minWidth: { sm: 150 } }}>
            <Chip
              label={tip.adjustment}
              size="small"
              color={directionColor[tip.direction]}
              variant="outlined"
            />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{tip.condition}</Typography>
            <Typography variant="body2" color="text.secondary">{tip.reason}</Typography>
            {tip.note && (
              <Alert
                severity="warning"
                variant="outlined"
                sx={{ mt: 1, py: 0, "& .MuiAlert-message": { fontWeight: 600 } }}
              >
                {tip.note}
              </Alert>
            )}
          </Box>
        </Stack>
      ))}
    </Stack>
  </Box>
);
