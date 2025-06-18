import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { RepoFileTree } from '../types';
import { CoreFile } from '@nat-lang/nat';

interface FileCtx {
  docTree: RepoFileTree;
  libTree: RepoFileTree;
  coreTree: CoreFile[];

  docs: Record<string, string | undefined>;
  lib: Record<string, string | undefined>;

  setDocTree: (docTree: RepoFileTree) => void;
  setLibTree: (libTree: RepoFileTree) => void;
  setCoreTree: (coreTree: CoreFile[]) => void;

  setDocFile: (path: string, content: string) => void;
  setLibFile: (path: string, content: string) => void;

  docsLoaded: boolean;
  libLoaded: boolean;
  setLibLoaded: () => void;
  setDocsLoaded: () => void;
}

const useFileCtx = create<FileCtx>()(set => ({
  docTree: [],
  libTree: [],
  coreTree: [],
  docs: {},
  lib: {},
  docsLoaded: false,
  libLoaded: false,
  setDocTree: docTree => set(_ => ({ docTree })),
  setLibTree: libTree => set(_ => ({ libTree })),
  setCoreTree: coreTree => set(_ => ({ coreTree })),
  setDocFile: (path, content) => set(state => ({ docs: { [path]: content, ...state.docs } })),
  setLibFile: (path, content) => set(state => ({ lib: { [path]: content, ...state.lib } })),
  setDocsLoaded: () => set(_ => ({ docsLoaded: true })),
  setLibLoaded: () => set(_ => ({ libLoaded: true }))
}));

export default useFileCtx;