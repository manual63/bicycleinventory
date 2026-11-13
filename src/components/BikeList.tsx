import { Grid } from "@mui/material";
import type { Bike } from "../types/bike";
import type { LoadStatus } from "../types/loadStatus";
import BikeCard from "./BikeCard";
import BikeCardSkeleton from "./BikeCardSkeleton";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";

type BikeListProps = {
  bikes: Bike[];
  onEdit: (bike: Bike) => void;
  status: LoadStatus;
  onAddBike: () => void;
  onRetry: () => void;
}

const cardGridSize = { xs: 12, sm: 6, md: 4 };

const BikeList = ({ bikes, onEdit, status, onAddBike, onRetry }: BikeListProps) => {
  if (status === "loading") return <Loading />;
  if (status === "error") return <ErrorState onRetry={onRetry} />;
  if (bikes.length === 0) return <EmptyState onAddBike={onAddBike} />;

  return (
    <Grid container spacing={2} sx={{ my: 2 }}>
      {bikes.map((bike) => (
        <Grid size={cardGridSize} key={bike.id}>
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
        <Grid size={cardGridSize} key={i}>
          <BikeCardSkeleton />
        </Grid>
      ))}
    </Grid>
  )
}

export default BikeList;
