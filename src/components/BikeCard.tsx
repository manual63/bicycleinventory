import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { useBikeStore } from "../store/bikeStore";
import { bikeTypeLabels, frameMaterialLabels, type Bike } from "../types/bike";

type BikeCardProps = {
  bike: Bike;
  onEdit: (bike: Bike) => void;
};

const BikeCard = ({ bike, onEdit }: BikeCardProps) => {

  const handleDelete = () => {
    useBikeStore.getState().removeBike(bike.id);
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">{bike.brand} {bike.model} {bike.isElectric && <ElectricBoltIcon fontSize="small" titleAccess="Electric" />} </Typography>
        <Typography variant="body2">Year: {bike.year}</Typography>
        <Typography variant="body2">Frame Material: {frameMaterialLabels[bike.frameMaterial]}</Typography>
        <Typography variant="body2">Type: {bikeTypeLabels[bike.type]}</Typography>
        {bike.serialNumber && (
          <Typography variant="body2">Serial Number: {bike.serialNumber}</Typography>
        )}
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={() => onEdit && onEdit(bike)}>
            Edit
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default BikeCard;
