import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Alert, Button, Card, CardContent, Chip, Divider, Grid, Stack, Typography } from "@mui/material";
import { formatDate } from "../../libs/dates";
import { needsAttention, totalMiles, type PartEntry } from "../../libs/maintenance";
import { frameMaterialLabels, suspensionTypeLabels, type Bike } from "../../types/bike";
import { getPartTypeInfo, partCategoryLabels, partDisplayName, type PartCategory } from "../../types/part";

type OverviewTabProps = {
  bike: Bike;
  entries: PartEntry[];
  onManageComponents: () => void;
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
    <Typography variant="body2" color="text.secondary">{label}</Typography>
    <Typography variant="body2" sx={{ textAlign: "right" }}>{value}</Typography>
  </Stack>
);

export const OverviewTab = ({ bike, entries, onManageComponents }: OverviewTabProps) => {
  const attentionCount = entries.filter((entry) => needsAttention(entry.health.status)).length;

  // Group parts by category, in the category order defined in partCategoryLabels.
  const partsByCategory = (Object.keys(partCategoryLabels) as PartCategory[])
    .map((category) => ({
      category,
      parts: bike.parts.filter((part) => getPartTypeInfo(part.type).category === category),
    }))
    .filter((group) => group.parts.length > 0);

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 5 }}>
        <Card variant="outlined" sx={{ borderRadius: 4 }}>
          <CardContent>
            <Typography variant="h6" component="h2" sx={{ mb: 2 }}>Bike info</Typography>
            <Stack spacing={1.5}>
              <Stack direction="row" sx={{ flexWrap: "wrap" }} spacing={1} useFlexGap>
                <Chip label={frameMaterialLabels[bike.frameMaterial]} variant="outlined" />
                <Chip
                  color={bike.suspension ? "default" : "warning"}
                  label={bike.suspension ? suspensionTypeLabels[bike.suspension] : "Suspension Not Set"}
                  variant="outlined"
                />
                {bike.isElectric && <Chip label="Electric" variant="outlined" />}
              </Stack>
              {bike.serialNumber && <DetailRow label="Serial number" value={bike.serialNumber} />}
              <DetailRow label="Acquired" value={bike.acquiredDate ? formatDate(bike.acquiredDate) : "Not set"} />
              <DetailRow label="Miles logged" value={`${(Math.round(totalMiles(bike.rides) * 10) / 10).toLocaleString()} mi`} />
              <DetailRow label="Components" value={String(bike.parts.length)} />
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 7 }}>
        <Card variant="outlined" sx={{ borderRadius: 4 }}>
          <CardContent>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" component="h2">Parts</Typography>
              <Button endIcon={<ArrowForwardIcon />} onClick={onManageComponents}>Manage components</Button>
            </Stack>
            {attentionCount > 0 && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                {attentionCount} {attentionCount === 1 ? "component needs" : "components need"} attention.
              </Alert>
            )}
            {partsByCategory.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No parts added yet.</Typography>
            ) : (
              <Stack spacing={2} divider={<Divider />}>
                {partsByCategory.map(({ category, parts }) => (
                  <Stack key={category} spacing={0.75}>
                    <Typography variant="overline" color="text.secondary">{partCategoryLabels[category]}</Typography>
                    {parts.map((part) => (
                      <DetailRow key={part.id} label={getPartTypeInfo(part.type).label} value={partDisplayName(part)} />
                    ))}
                  </Stack>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
