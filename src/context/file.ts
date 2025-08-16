import { create } from 'zustand';
import { RepoFileTree } from '../types';
import { CoreFile } from '@nat-lang/nat';

export type FileMap = Record<string, string | undefined>;

interface FileCtx {
  docTree: RepoFileTree;
  libTree: RepoFileTree;
  coreTree: CoreFile[];

  docs: FileMap;
  lib: FileMap;

  setDocTree: (docTree: RepoFileTree) => void;
  setLibTree: (libTree: RepoFileTree) => void;
  setCoreTree: (coreTree: CoreFile[]) => void;

  setDocFile: (path: string, content: string) => void;
  setLibFile: (path: string, content: string) => void;

  docsLoaded: boolean;
  libLoaded: boolean;
  ctxLoaded: boolean;
  filesLoaded: () => boolean;

  setLibLoaded: () => void;
  setDocsLoaded: () => void;
  setCtxLoaded: (v: boolean) => void;
}

const useFileCtx = create<FileCtx>()((set, get) => ({
  docTree: [],
  libTree: [],
  coreTree: [],
  docs: {},
  lib: {},
  anchors: {},
  canvasRefs: {},
  docsLoaded: false,
  libLoaded: false,
  ctxLoaded: false,
  setDocTree: docTree => set(_ => ({ docTree })),
  setLibTree: libTree => set(_ => ({ libTree })),
  setCoreTree: coreTree => set(_ => ({ coreTree })),
  setDocFile: (path, content) => set(state => ({ docs: { ...state.docs, [path]: content, } })),
  setLibFile: (path, content) => set(state => ({ lib: { ...state.lib, [path]: content, } })),
  setDocsLoaded: () => set(_ => ({ docsLoaded: true })),
  setLibLoaded: () => set(_ => ({ libLoaded: true })),
  setCtxLoaded: v => set(_ => ({ ctxLoaded: v })),
  filesLoaded: () => get().docsLoaded && get().libLoaded && get().ctxLoaded
}));

export default useFileCtx;