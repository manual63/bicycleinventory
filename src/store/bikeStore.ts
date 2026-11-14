import { create } from "zustand";
import type { Bike } from "../types/bike";
import type { LoadStatus } from '../types/loadStatus';

type BikeState = {
  bikes: Bike[];
  status: LoadStatus;
  loadStarted: () => void;
  loadFailed: () => void;
  setBikes: (bikes: Bike[]) => void;       // load everything (on first visit to the bikes page)
  bikeAdded: (bike: Bike) => void;         // note: a full Bike now, not NewBike
  bikeUpdated: (bike: Bike) => void;       // the saved bike from the repo
  bikeRemoved: (id: Bike["id"]) => void;
};

export const useBikeStore = create<BikeState>()((set) => ({
  bikes: [],
  status: "loading",
  loadStarted: () => set({ status: "loading" }),
  loadFailed: () => set({ status: "error" }),
  setBikes: (bikes) => set({ bikes, status: "ready" }),
  bikeAdded: (bike) => set((state) => ({ bikes: [...state.bikes, bike] })),
  bikeUpdated: (updated) => set((state) => ({
    bikes: state.bikes.map((bike) => (bike.id === updated.id ? updated : bike))
  })),
  bikeRemoved: (id) => set((state) => ({ bikes: state.bikes.filter((bike) => bike.id !== id) }))
}));
