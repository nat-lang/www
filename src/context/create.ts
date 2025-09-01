import { v4 } from 'uuid';
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CreateCtx {
  content: string;
  path: string;
  setContent: (content: string) => void;
}

const useCreateCtx = create<CreateCtx>()(
  persist(
    set => ({
      content: "use library/prelude",
      path: v4(),
      setContent: content => set(_ => ({ content })),
    }),
    {
      name: 'create',
    },
  )
);

export default useCreateCtx;