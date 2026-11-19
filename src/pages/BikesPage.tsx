import { Dialog, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useSearchParams } from 'react-router';
import AddBikeButton from '../components/bikes/AddBikeButton';
import BikeForm from '../components/bikes/BikeForm';
import BikeList from '../components/bikes/BikeList';
import { useBikeActions } from '../hooks/useBikeActions';
import { useLoadBikes } from '../hooks/useLoadBikes';
import { useBikeStore } from '../store/bikeStore';
import { toNewBike, type Bike, type NewBike } from '../types/bike';

type DialogState = { open: boolean } & (
  | { mode: "add" }
  | { mode: "edit"; bike: Bike }
);

export const BikesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { status, retry } = useLoadBikes();

  const [dialog, setDialog] = useState<DialogState>(() =>
    searchParams.get("add") === "true" // Checks if there is a param in the url add=true
      ? { open: true, mode: "add" } // Opens the add a bike model 
      : { open: false, mode: "add" } // Keeps the modal closed
  );

  // Store functions and values
  const myBikes = useBikeStore((s) => s.bikes);

  // Determies whether to modal opens empty or with an existing bike
  const { addBike, updateBike } = useBikeActions();

  const closeDialog = () => {
    setDialog((prev) => ({ ...prev, open: false }));
    setSearchParams({}, { replace: true }); // Removes the param in the url
  }

  const handleSubmit = async (data: NewBike) => {
    if (dialog.mode === "edit") {
      await updateBike(dialog.bike.id, data);
    } else {
      await addBike(data);
    }
    closeDialog();
  };

  const handleEdit = (bike: Bike) => {
    setDialog({ open: true, mode: "edit", bike })
  }

  const handleAdd = () => {
    setDialog({ open: true, mode: "add" });
  }

  return (
    <>
      <Stack direction="row" sx={{ justifyContent: "space-between", my: 2 }}>
        <Typography variant="h3" component="h1">My Bikes</Typography>
        <AddBikeButton variant="contained" onClick={handleAdd} />
      </Stack>
      <BikeList
        bikes={myBikes}
        onEdit={handleEdit}
        status={status}
        onAddBike={handleAdd}
        onRetry={retry}
      />
      <Dialog
        open={dialog.open}
        onClose={closeDialog}
        fullWidth
      >
        <DialogTitle>
          {
            dialog.mode === "edit" ?
              "Edit Bike" :
              "Add Bike"
          }
        </DialogTitle>
        <DialogContent>
          <BikeForm
            initialValues={dialog.mode === "edit" ? toNewBike(dialog.bike) : undefined}
            onSubmit={handleSubmit}
            buttonText={dialog.mode === "edit" ? "Save Changes" : "Add Bike"}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
