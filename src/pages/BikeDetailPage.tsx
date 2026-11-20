import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import { Card, CardContent, CardHeader, Chip, Divider, Stack, Typography } from "@mui/material";
import { useParams } from "react-router";
import { BikeDetailSkeleton } from '../components/bikes/BikeDetailSkeleton';
import ErrorState from '../components/bikes/ErrorState';
import { useLoadBikes } from '../hooks/useLoadBikes';
import { usd } from '../libs/utils';
import { useBikeStore } from "../store/bikeStore";
import { bikeTypeLabels, frameMaterialLabels, suspensionTypeLabels } from "../types/bike";
import { PageNotFound } from './PageNotFound';

type DetailRowProps = {
  label: string,
  value: string,
  boldLabel?: boolean
}

const DetailRow = ({ label, value, boldLabel = false }: DetailRowProps) => {
  return (
    <Stack direction="row" sx={{ justifyContent: "space-between" }}>
      <Typography variant="body2" sx={{ fontWeight: boldLabel ? "bold" : "inherit" }}>{label}</Typography>
      <Typography variant="body2">{value}</Typography>
    </Stack>
  )
}

export const BikeDetailPage = () => {
  const { bikeId } = useParams();
  const { status, retry } = useLoadBikes();
  const bike = useBikeStore((s) => s.bikes.find((bike) => bike.id === bikeId));

  if (status === "loading") return <BikeDetailSkeleton />
  if (status === "error") return <ErrorState onRetry={retry} />;
  if (!bike) return <PageNotFound />

  const totalCost = bike.parts.reduce((sum, part) => sum + part.cost, 0);

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", my: 2 }}>
      <CardHeader
        title={
          <>
            {bike.brand} {bike.model}{" "}
            {bike.isElectric && <ElectricBoltIcon fontSize="small" titleAccess="Electric" />}
          </>
        }
        subheader={`${bike.year} \u00B7 ${bikeTypeLabels[bike.type]}`}
        slotProps={{
          title: { variant: "h3", component: "h1" }
        }}
      />
      <CardContent sx={{ flexGrow: 1, pt: 0 }}>
        <Stack spacing={1}>
          <Stack direction="row" sx={{ flexWrap: "wrap" }} spacing={1} useFlexGap>
            <Chip
              label={frameMaterialLabels[bike.frameMaterial]}
              variant="outlined"
            />
            <Chip
              color={bike.suspension ? "default" : "warning"}
              label={bike.suspension ? suspensionTypeLabels[bike.suspension] : "Suspension Not Set"}
              variant="outlined"
            />
          </Stack>
          {bike.serialNumber && (
            <DetailRow label="Serial Number" value={bike.serialNumber} />
          )}
          <Divider sx={{ my: 1 }} />
          <Typography variant="h5" component="h2">Parts</Typography>
          {bike.parts.length > 0 ? (
            <>
              {bike.parts.map((part, index) =>
                <DetailRow key={index} label={part.name} value={usd.format(part.cost)} />
              )}
              <DetailRow label="Total Parts Cost" value={usd.format(totalCost)} boldLabel />
            </>
          ) : <Typography variant="body2">No Parts Added</Typography>}

        </Stack>
      </CardContent>
    </Card>
  );
};
