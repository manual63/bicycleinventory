import { create } from "zustand";
import type { Bike, BikeChanges, NewBike } from "../types/bike";

const myBikes: Bike[] = [
  {
    id: '1',
    brand: 'Custom',
    model: 'Shad Life Hardtail',
    year: 2026,
    frameMaterial: 'steel',
    type: 'mountain',
    isElectric: false,
  },
  {
    id: '2',
    brand: 'DWA',
    model: 'Fifty Foe',
    year: 2022,
    frameMaterial: 'steel',
    type: 'bmx',
    isElectric: false,
  },
  {
    id: '3',
    brand: 'Santa Cruz',
    model: 'Vala',
    year: 2025,
    frameMaterial: 'carbon-fiber',
    type: 'mountain',
    isElectric: true,
  },
];

type BikeState = {
  bikes: Bike[];
  addBike: (bike: NewBike) => void;
  removeBike: (id: string) => void;
  updateBike: (id: string, changes: BikeChanges) => void;
};

export const useBikeStore = create<BikeState>()((set) => ({
  bikes: myBikes,
  addBike: (bike) => set((state) => ({ bikes: [...state.bikes, { ...bike, id: crypto.randomUUID() }] })),
  removeBike: (id) => set((state) => ({ bikes: state.bikes.filter((bike) => bike.id !== id) })),
  updateBike: (id, changes) =>
    set((state) => ({
      bikes: state.bikes.map((bike) => (bike.id === id ? { ...bike, ...changes } : bike))
    }))
}));