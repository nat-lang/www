import { v4 } from 'uuid';
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CreateCtx {
  doc: string;
  lib: string;
  docPath: string;
  libPath: string;
  setDoc: (content: string) => void;
  setLib: (content: string) => void;
}

const useCreateCtx = create<CreateCtx>()(
  persist(
    set => ({
      doc: "use ../prelude",
      lib: "use prelude",
      docPath: v4(),
      libPath: v4(),
      setDoc: content => set(_ => ({ doc: content })),
      setLib: content => set(_ => ({ lib: content }))
    }),
    {
      name: 'create',
    },
  )
);

export default useCreateCtx;