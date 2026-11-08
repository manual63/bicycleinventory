import { Container, Dialog, DialogContent, DialogTitle } from '@mui/material';
import BikeCard from './components/BikeCard';
import { useBikeStore } from './store/bikeStore';
import BikeForm from './components/BikeForm';
import { useState } from 'react';
import { toNewBike, type Bike } from './types/bike';

function App() {
  const [editingBike, setEditingBike] = useState<Bike | null>(null);
  const updateBike = useBikeStore((s) => s.updateBike);

  const myBikes = useBikeStore((s) => s.bikes);
  const addBike = useBikeStore((s) => s.addBike);
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
              onSubmit={(changes) => {
                updateBike(editingBike.id, changes);
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
