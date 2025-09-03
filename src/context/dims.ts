import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Dims = {
  left: number;
  center: number;
  right: number;
};

type DimsCtx = Dims & {
  scale: number;
  setDims: (fn: ((dims: Dims) => Dims)) => void,
  setScale: (fn: ((scale: number) => number)) => void,
}

const useDimsCtx = create<DimsCtx>()(
  persist(
    (set) => ({
      left: 15,
      center: 84,
      right: 1,
      scale: 1.5,
      setDims: fn => set(({ left, center, right }) => fn({ left, center, right })),
      setScale: fn => set(({ scale }) => ({ scale: fn(scale) })),
    }),
    {
      name: 'dims',
      partialize: ({ left, center, right }) => ({ left, center, right })
    },
  )
);

export default useDimsCtx;