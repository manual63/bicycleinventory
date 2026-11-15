import { Dialog, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import AddBikeButton from '../components/AddBikeButton';
import BikeForm from '../components/BikeForm';
import BikeList from '../components/BikeList';
import { useBikeActions } from '../hooks/useBikeActions';
import { getErrorMessage } from '../libs/utils';
import { useBikeRepository } from '../repositories/BikeRepositoryContext';
import { useBikeStore } from '../store/bikeStore';
import { useToastStore } from '../store/toastStore';
import { toNewBike, type Bike, type NewBike } from '../types/bike';

type DialogState = { open: boolean } & (
  | { mode: "add" }
  | { mode: "edit"; bike: Bike }
);

export const BikesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [dialog, setDialog] = useState<DialogState>(() =>
    searchParams.get("add") === "true" // Checks if there is a param in the url add=true
      ? { open: true, mode: "add" } // Opens the add a bike model 
      : { open: false, mode: "add" } // Keeps the modal closed
  );

  // Store functions and values
  const myBikes = useBikeStore((s) => s.bikes);
  const loadingStatus = useBikeStore((s) => s.status);
  const loadStarted = useBikeStore((s) => s.loadStarted);
  const loadFailed = useBikeStore((s) => s.loadFailed);
  const showToast = useToastStore((s) => s.showToast);
  const setBikes = useBikeStore((s) => s.setBikes);

  // Determies whether to modal opens empty or with an existing bike
  const { addBike, updateBike } = useBikeActions();
  const repository = useBikeRepository();
  
  const loadBikes = useCallback(() => {
    repository.getAll().then((bikes) => {
      setBikes(bikes);
    }).catch((error) => {
      loadFailed();
      showToast(`Error loading bikes! Message: ${getErrorMessage(error)}`, "error");
    });
  }, [repository, setBikes, showToast, loadFailed]);

  useEffect(() => {
    const status = useBikeStore.getState().status;   // peek at the store, right now
    if (status === "ready") return;                  // case 1: nothing to do, stop here
    if (status === "error") loadStarted();           // case 3: switch back to "loading" first
    loadBikes();                                     // cases 2 and 3 both end up here
  }, [loadBikes, loadStarted]);

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

  const handleRetry = () => {
    loadStarted();
    loadBikes();
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
        status={loadingStatus}
        onAddBike={handleAdd}
        onRetry={handleRetry}
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
