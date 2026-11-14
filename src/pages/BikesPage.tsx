import { Dialog, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
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
  const [dialog, setDialog] = useState<DialogState>({ open: false, mode: "add" });
  const myBikes = useBikeStore((s) => s.bikes);
  const loadingStatus = useBikeStore((s) => s.status);
  const loadStarted = useBikeStore((s) => s.loadStarted);
  const loadFailed = useBikeStore((s) => s.loadFailed);
  const showToast = useToastStore((s) => s.showToast);
  const { addBike, updateBike } = useBikeActions();

  const repository = useBikeRepository();
  const setBikes = useBikeStore((s) => s.setBikes);

  const loadBikes = useCallback(() => {
    repository.getAll().then((bikes) => {
      setBikes(bikes);
    }).catch((error) => {
      loadFailed();
      showToast(`Error loading bikes! Message: ${getErrorMessage(error)}`, "error")
    });
  }, [repository, setBikes, showToast, loadFailed]);

  useEffect(() => {
    loadBikes();
  }, [loadBikes]);

  const closeDialog = () => setDialog((prev) => ({ ...prev, open: false }));

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
