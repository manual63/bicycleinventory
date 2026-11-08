import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import { Button, Card, CardContent, Typography } from "@mui/material";
import { useBikeStore } from "../store/bikeStore";
import { bikeTypeLabels, frameMaterialLabels, type Bike } from "../types/bike";

type BikeCardProps = {
  bike: Bike;
};

const BikeCard = ({ bike }: BikeCardProps) => {

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
        <Button variant="contained" color="error" onClick={handleDelete}>
          Delete
        </Button>
      </CardContent>
    </Card>
  );
};

export default BikeCard;