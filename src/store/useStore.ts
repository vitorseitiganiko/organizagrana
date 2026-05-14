import { create } from 'zustand';

interface StoreState {
  suggestedNames: Array<string>;
  addSuggestedName: (name: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  suggestedNames: [],
  addSuggestedName: (name: string) => set((state) => ({ suggestedNames: [...state.suggestedNames, name] })),
}));
