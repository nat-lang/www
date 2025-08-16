import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { vw2px } from '../utilities';

export type Dims = {
  left: number;
  center: number;
  right: number;
};

type DimsCtx = Dims & {
  scale: number;
  canvas: () => number;
  setDims: (fn: ((dims: Dims) => Dims)) => void,
  setScale: (fn: ((scale: number) => number)) => void,
}

const useDimsCtx = create<DimsCtx>()(
  persist(
    (set, get) => ({
      left: 15,
      center: 84,
      right: 1,
      scale: 1.5,
      setDims: fn => set(({ left, center, right }) => fn({ left, center, right })),
      setScale: fn => set(({ scale }) => ({ scale: fn(scale) })),
      canvas: () => vw2px(get().center) * 0.667
    }),
    {
      name: 'dims',
    },
  )
);

export default useDimsCtx;