import { create } from 'zustand';
import { RepoFile, RepoFileArray } from '../types';
import { CoreFile } from '@nat-lang/nat';

export type FileMap = Record<string, string | undefined>;

export type FileTree = {
  children?: FileTree[];
  path: string;
  type: string;
}

export const fileArrayToTree = (repo: RepoFileArray): FileTree[] => {
  const trees = [];

  for (let i = 0; i < repo.length; i++) {
    if (!repo[i].path) continue;
    if (!repo[i].type) continue;

    const node: FileTree = { ...repo[i], path: repo[i].path!, type: repo[i].type!, children: [] };

    if (node.type === "tree") {
      console.log("ndoe tree", node);
      const slice = [];
      console.log(repo.length, repo[i + 1]);
      while (i + 1 < repo.length && repo[i + 1].path && repo[i + 1].path!.startsWith(node.path)) {
        slice.push(repo[++i]);

      }
      console.log("node slice", slice);
      node.children = fileArrayToTree(slice);
    }

    trees.push(node);
  }

  return trees as FileTree[];
}

interface FileCtx {
  repo: FileTree[];
  core: FileTree[];
  repoMap: FileMap;

  setRepo: (tree: FileTree[]) => void;
  setCore: (tree: FileTree[]) => void;
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