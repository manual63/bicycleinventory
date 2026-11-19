import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import { Card, CardContent, CardHeader, Chip, Stack } from "@mui/material";
import { useParams } from "react-router";
import ErrorState from '../components/bikes/ErrorState';
import { useLoadBikes } from '../hooks/useLoadBikes';
import { useBikeStore } from "../store/bikeStore";
import { bikeTypeLabels, frameMaterialLabels, suspensionTypeLabels } from "../types/bike";
import { PageNotFound } from './PageNotFound';

export const BikeDetailPage = () => {
  const { bikeId } = useParams();
  const { status, retry } = useLoadBikes();
  const bike = useBikeStore((s) => s.bikes.find((bike) => bike.id === bikeId));

  if (status === "loading") return <>Page Loading ...</>; //TODO: Create a skeleton
  if (status === "error") return <ErrorState onRetry={retry} />;
  if (!bike) return <PageNotFound />

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
        slotProps={{ title: { variant: "h5", component: "h2" } }}
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
        </Stack>
      </CardContent>
    </Card>
  )
}

