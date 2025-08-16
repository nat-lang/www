import { create } from 'zustand';

interface RuntimeCtx {
  initialized: boolean;
  setInitialized: () => void;
}

const useRuntimeCtx = create<RuntimeCtx>()(set => ({
  initialized: false,
  setInitialized: () => set(_ => ({ initialized: true })),
}));


export default useRuntimeCtx;