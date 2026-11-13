import PedalBikeIcon from '@mui/icons-material/PedalBike';
import { Stack, Typography } from '@mui/material';
import AddBikeButton from './AddBikeButton';

type EmptyStateProps = {
  onAddBike: () => void;
}

const EmptyState = ({ onAddBike }: EmptyStateProps) => {
  return (
    <Stack sx={{ alignItems: "center", py: 2 }} spacing={2}>
      <PedalBikeIcon sx={{ fontSize: 64, color: "text.secondary" }} />
      <Typography variant="h5" component="h2" color="text.primary">No bikes added to list yet!</Typography>
      <Typography variant="body1" color="text.secondary">Add your first bike to start tracking your inventory.</Typography>
      <AddBikeButton onClick={onAddBike} variant="contained" />
    </Stack>
  )
}

export default EmptyState;
