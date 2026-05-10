import { addIssueToContext } from 'zod/v3';
import { create } from 'zustand';

export const useStore = create((set) => ({
  suggestedNames: [],
  addSuggestedName: (name) => set((state) => ({ suggestedNames: [...state.suggestedNames, name] })),
}));
