import { Container, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useEffect, useState } from 'react';
import AppHeader from './components/AppHeader';
import BikeForm from './components/BikeForm';
import BikeList from './components/BikeList';
import Toaster from './components/Toaster';
import { useBikeActions } from './hooks/useBikeActions';
import { getErrorMessage } from './libs/utils';
import { useBikeRepository } from './repositories/BikeRepositoryContext';
import { useBikeStore } from './store/bikeStore';
import { useToastStore } from './store/toastStore';
import { toNewBike, type Bike, type NewBike } from './types/bike';
import type { LoadStatus } from './types/loadStatus';

type DialogState = { open: boolean } & (
  | { mode: "add" }
  | { mode: "edit"; bike: Bike }
);

function App() {
  const [dialog, setDialog] = useState<DialogState>({ open: false, mode: "add" });
  const [loadingStatus, setLoadingStatus] = useState<LoadStatus>("loading");
  const myBikes = useBikeStore((s) => s.bikes);
  const showToast = useToastStore((s) => s.showToast);
  const { addBike, updateBike } = useBikeActions();

  const repository = useBikeRepository();
  const setBikes = useBikeStore((s) => s.setBikes);

  useEffect(() => {
    repository.getAll().then((bikes) => {
      setBikes(bikes);
      setLoadingStatus("ready");
    }).catch((error) => {
      setLoadingStatus("error");
      showToast(`Error loading bikes! Message: ${getErrorMessage(error)}`, "error")
    });
  }, [repository, setBikes, showToast]);

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

  return (
    <>
      <AppHeader onAddBike={() => setDialog({ open: true, mode: "add" })} />
      <Container>
        <BikeList
          bikes={myBikes}
          onEdit={handleEdit}
          status={loadingStatus}
        />
      </Container>
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
      <Toaster />
    </>
  );
}

export default App
