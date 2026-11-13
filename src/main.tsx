import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import type { BikeRepository } from './repositories/BikeRepository.ts';
import { BikeRepositoryContext } from './repositories/BikeRepositoryContext.ts';
import { DelayedBikeRepository } from './repositories/DelayedBikeRepository.ts';
import { LocalStorageBikeRepository } from './repositories/LocalStorageBikeRepository.ts';
import { theme } from './theme.ts';
//import { FailingBikeRepository } from './repositories/FailingBikeRepository.ts';

const bikeRepository: BikeRepository = new DelayedBikeRepository(new LocalStorageBikeRepository());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BikeRepositoryContext value={bikeRepository}>
        <App />
      </BikeRepositoryContext>
    </ThemeProvider>
  </StrictMode>,
);
