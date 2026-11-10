import { Container, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useEffect, useState } from 'react';
import BikeCard from './components/BikeCard';
import BikeForm from './components/BikeForm';
import { useBikeActions } from './hooks/useBikeActions';
import { useBikeRepository } from './repositories/BikeRepositoryContext';
import { useBikeStore } from './store/bikeStore';
import { toNewBike, type Bike } from './types/bike';

function App() {
  const [editingBike, setEditingBike] = useState<Bike | null>(null);
  const myBikes = useBikeStore((s) => s.bikes);
  const { addBike, updateBike } = useBikeActions();

  const repository = useBikeRepository();
  const setBikes = useBikeStore((s) => s.setBikes);

  useEffect(() => {
    repository.getAll().then(setBikes);
  }, [repository, setBikes])

  return (
    <>
      <Container>
        <BikeForm onSubmit={addBike} buttonText="Add Bike" />
        {myBikes.map((bike) => (
          <BikeCard key={bike.id} bike={bike} onEdit={(bike) => setEditingBike(bike)} />
        ))}
      </Container>
      <Dialog open={editingBike !== null} onClose={() => setEditingBike(null)} fullWidth>
        <DialogTitle>Edit Bike</DialogTitle>
        <DialogContent>
          {editingBike && (
            <BikeForm
              initialValues={toNewBike(editingBike)}
              onSubmit={async (changes) => {
                await updateBike(editingBike.id, changes);
                setEditingBike(null);
              }}
              buttonText="Save Changes"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}


export default App
