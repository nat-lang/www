import { create } from 'zustand';
import { RepoFile, RepoFileArray } from '../types';
import { CoreFile } from '@nat-lang/nat';

export type FileMap = Record<string, string | undefined>;

export type FileTree = {
  children?: FileTree[];
  path: string;
  type: string;
}

export const repoArrayToTree = (repo: RepoFileArray): FileTree[] => {
  const trees = [];

  for (let i = 0; i < repo.length; i++) {
    const node = repo[i];


    if (!node.path) continue;

    if (node.type === "tree") {
      const slice = [];

      while (i + 1 < repo.length && repo[i + 1].path && repo[i + 1].path!.startsWith(node.path)) {
        slice.push(repo[++i]);

      }

      (node as FileTree).children = repoArrayToTree(slice);
      trees.push(node);
    } else {
      trees.push(node);
    }
  }

  return trees as FileTree[];
}

interface FileCtx {
  repo: FileTree[];
  core: CoreFile[];
  repoMap: FileMap;

  setRepo: (tree: FileTree[]) => void;
  setCore: (tree: CoreFile[]) => void;
  setRepoFile: (path: string, content: string) => void;

  repoLoaded: boolean;
  ctxLoaded: boolean;
  filesLoaded: () => boolean;

  setRepoLoaded: () => void;
  setCtxLoaded: (v: boolean) => void;
}

const useFileCtx = create<FileCtx>()((set, get) => ({
  repo: [],
  core: [],
  repoMap: {},
  anchors: {},
  canvasRefs: {},
  repoLoaded: false,
  ctxLoaded: false,
  setRepo: repo => set(_ => ({ repo })),
  setCore: core => set(_ => ({ core })),
  setRepoFile: (path, content) => set(state => ({ repoMap: { ...state.repoMap, [path]: content, } })),
  setRepoLoaded: () => set(_ => ({ repoLoaded: true })),
  setCtxLoaded: v => set(_ => ({ ctxLoaded: v })),
  filesLoaded: () => get().repoLoaded && get().ctxLoaded
}));

export default useFileCtx;