import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import { Button, Card, CardActions, CardContent, CardHeader, Chip, Divider, Stack, Typography } from "@mui/material";
import { useState } from 'react';
import { useBikeActions } from '../hooks/useBikeActions';
import { usd } from '../libs/utils';
import { bikeTypeLabels, frameMaterialLabels, type Bike } from "../types/bike";
import ConfirmDialog from './ConfirmDialog';

type BikeCardProps = {
  bike: Bike;
  onEdit: (bike: Bike) => void;
};

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

const BikeCard = ({ bike, onEdit }: BikeCardProps) => {
  const { removeBike } = useBikeActions();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = async () => {
    await removeBike(bike.id);
    setConfirmOpen(false);
  }

  const totalCost = bike.parts.reduce((sum, part) => sum + part.cost, 0);

  return (
    <>
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
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
            <Chip label={frameMaterialLabels[bike.frameMaterial]} variant="outlined" />
            {bike.serialNumber && (
              <DetailRow label="Serial Number" value={bike.serialNumber} />
            )}

            {bike.parts.length > 0 && (
              <>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1" component="h3">Parts</Typography>
                {bike.parts.map((part, index) =>
                  <DetailRow key={index} label={part.name} value={usd.format(part.cost)} />
                )}
                <DetailRow label="Total Parts Cost" value={usd.format(totalCost)} boldLabel />
              </>
            )}
          </Stack>
        </CardContent>
        <CardActions>
          <Stack direction="row" spacing={1} sx={{ p: 1 }}>
            <Button variant="contained" color="primary" onClick={() => onEdit(bike)}>
              Edit
            </Button>
            <Button variant="contained" color="error" onClick={() => setConfirmOpen(true)}>
              Delete
            </Button>
          </Stack>
        </CardActions>
      </Card>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Bike?"
        message={<>This will permanently delete <strong>{bike.brand} {bike.model}!</strong></>}
        confirmText="Delete"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        confirmColor="error"
      />
    </>
  );
}

export default BikeCard;
