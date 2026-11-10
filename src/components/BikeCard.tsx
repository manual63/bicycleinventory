import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { useBikeActions } from '../hooks/useBikeActions';
import { usd } from '../libs/utils';
import { bikeTypeLabels, frameMaterialLabels, type Bike } from "../types/bike";

type BikeCardProps = {
  bike: Bike;
  onEdit: (bike: Bike) => void;
};

const BikeCard = ({ bike, onEdit }: BikeCardProps) => {
  const { removeBike } = useBikeActions();

  const handleDelete = () => {
    removeBike(bike.id);
  }

  const totalCost = bike.parts.reduce((sum, part) => sum + part.cost, 0);

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
        {bike.parts.length > 0 && (
          <>
            <Typography variant="h5">Parts</Typography>
            {bike.parts.map((part, index) =>
              <Stack direction="row" spacing={2} key={index}>
                <Typography variant="body2">Part: {part.name}</Typography>
                <Typography variant="body2">Cost: {usd.format(part.cost)}</Typography>
              </Stack>
            )}
            <Typography variant="body2">Total Parts Cost: {usd.format(totalCost)}</Typography>
          </>
        )}
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={() => onEdit(bike)}>
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
