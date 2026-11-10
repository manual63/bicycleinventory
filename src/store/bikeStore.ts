import { create } from "zustand";
import type { Bike } from "../types/bike";

type BikeState = {
  bikes: Bike[];
  setBikes: (bikes: Bike[]) => void;       // load everything (on startup)
  bikeAdded: (bike: Bike) => void;         // note: a full Bike now, not NewBike
  bikeUpdated: (bike: Bike) => void;       // the saved bike from the repo
  bikeRemoved: (id: Bike["id"]) => void;
};

export const useBikeStore = create<BikeState>()((set) => ({
  bikes: [],
  setBikes: (bikes) => set({ bikes }),
  bikeAdded: (bike) => set((state) => ({bikes: [...state.bikes, bike]})),
  bikeUpdated: (updated) => set((state) => ({
    bikes: state.bikes.map((bike) => (bike.id === updated.id ? updated : bike))
  })),
  bikeRemoved: (id) => set((state) => ({ bikes: state.bikes.filter((bike) => bike.id !== id) }))
}));