import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import { Button, Card, CardActions, CardContent, CardHeader, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useState } from 'react';
import { Link } from 'react-router';
import { useBikeActions } from '../../hooks/useBikeActions';
import { bikeTypeLabels, frameMaterialLabels, suspensionTypeLabels, type Bike } from '../../types/bike';
import ConfirmDialog from '../feedback/ConfirmDialog';
import { LogRideDialog } from '../maintenance/LogRideDialog';

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
  const [rideOpen, setRideOpen] = useState(false);

  const handleDelete = async () => {
    await removeBike(bike.id);
    setConfirmOpen(false);
  }

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
          action={
            <Stack direction="row">
              <Tooltip title="Edit bike">
                <IconButton aria-label={`Edit ${bike.brand} ${bike.model}`} onClick={() => onEdit(bike)}>
                  <EditOutlinedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete bike">
                <IconButton
                  aria-label={`Delete ${bike.brand} ${bike.model}`}
                  onClick={() => setConfirmOpen(true)}
                  sx={{ "&:hover": { color: "error.main" } }}
                >
                  <DeleteOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          }
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
            {bike.parts.length > 0 && (
              <DetailRow label="Parts" value={bike.parts.length.toString()} />
            )}
          </Stack>

        </CardContent>
        <CardActions>
          <Stack direction="row" spacing={1} sx={{ p: 1, width: "100%", justifyContent: "space-between" }}>
            <Button variant="contained" startIcon={<DirectionsBikeIcon />} onClick={() => setRideOpen(true)}>
              Log miles
            </Button>
            <Button variant="text" component={Link} to={`/bikes/${bike.id}`}>View</Button>
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
      <LogRideDialog bike={bike} open={rideOpen} onClose={() => setRideOpen(false)} />
    </>
  );
}

export default BikeCard;
