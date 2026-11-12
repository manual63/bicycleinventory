import { Container, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useEffect, useState } from 'react';
import AppHeader from './components/AppHeader';
import BikeCard from './components/BikeCard';
import BikeForm from './components/BikeForm';
import Toaster from './components/Toaster';
import { useBikeActions } from './hooks/useBikeActions';
import { useBikeRepository } from './repositories/BikeRepositoryContext';
import { useBikeStore } from './store/bikeStore';
import { toNewBike, type Bike, type NewBike } from './types/bike';

type DialogState = { open: boolean } & (
  | { mode: "add" }
  | { mode: "edit"; bike: Bike }
);

function App() {
  const [dialog, setDialog] = useState<DialogState>({ open: false, mode: "add" });
  const myBikes = useBikeStore((s) => s.bikes);
  const { addBike, updateBike } = useBikeActions();

  const repository = useBikeRepository();
  const setBikes = useBikeStore((s) => s.setBikes);

  useEffect(() => {
    repository.getAll().then(setBikes);
  }, [repository, setBikes]);

  const closeDialog = () => setDialog((prev) => ({ ...prev, open: false }));

  const handleSubmit = async (data: NewBike) => {
    if (dialog.mode === "edit") {
      await updateBike(dialog.bike.id, data);
    } else {
      await addBike(data);
    }
    closeDialog();
  };



  return (
    <>
      <AppHeader onAddBike={() => setDialog({ open: true, mode: "add" })} />
      <Container>
        {myBikes.map((bike) => (
          <BikeCard key={bike.id} bike={bike} onEdit={(bike) => setDialog({ open: true, mode: "edit", bike })} />
        ))}
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
