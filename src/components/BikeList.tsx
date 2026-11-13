import { Grid } from "@mui/material";
import type { Bike } from "../types/bike";
import type { LoadStatus } from "../types/loadStatus";
import BikeCard from "./BikeCard";
import BikeCardSkeleton from "./BikeCardSkeleton";

type BikeListProps = {
  bikes: Bike[];
  onEdit: (bike: Bike) => void;
  status: LoadStatus;
}

const BikeList = ({ bikes, onEdit, status }: BikeListProps) => {
  if (status === "loading") return <Loading />;
  if (status === "error") return /* ... */;
  if (bikes.length === 0) return /* ... */;

  return (
    <Grid container spacing={2} sx={{ my: 2 }}>
      {bikes.map((bike) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={bike.id}>
          <BikeCard
            bike={bike}
            onEdit={onEdit}
          />
        </Grid>
      ))}
    </Grid>
  );
};

const Loading = () => {
  return (
    <Grid container spacing={2} sx={{ my: 2 }}>
      {Array.from({ length: 6 }, (_, i) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
          <BikeCardSkeleton />
        </Grid>
      ))}
    </Grid>
  )
}

export default BikeList;
