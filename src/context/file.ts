import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { RepoFileTree } from '../types';
import { CoreFile } from '@nat-lang/nat';

interface FileCtx {
  docs: RepoFileTree;
  lib: RepoFileTree;
  core: CoreFile[];

  setDocs: (docs: RepoFileTree) => void;
  setLib: (docs: RepoFileTree) => void;
  setCore: (docs: CoreFile[]) => void;
}

const useFileCtx = create<FileCtx>()(
  persist(
    set => ({
      docs: [],
      lib: [],
      core: [],
      setDocs: docs => set(_ => ({ docs })),
      setLib: lib => set(_ => ({ lib })),
      setCore: core => set(_ => ({ core })),

    }),
    {
      name: 'file',
    },
  ),
);

export default useFileCtx;