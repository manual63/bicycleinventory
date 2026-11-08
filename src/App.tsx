import { Container } from '@mui/material';
import BikeCard from './components/BikeCard';
import { useBikeStore } from './store/bikeStore';
import AddBikeForm from './components/AddBikeForm';

function App() {
  const myBikes = useBikeStore((s) => s.bikes);
  return (
    <Container>
      <AddBikeForm />
      {myBikes.map((bike) => (
        <BikeCard key={bike.id} bike={bike} />
      ))}
    </Container>
  )
}

export default App
