import { create } from 'zustand'
import Git from '../service/git';

interface GitCtx {
  git: Git | null;
  setGit: (git: Git) => void;
}
const useGitCtx = create<GitCtx>()(
  set => ({
    git: null,
    setGit: git => set(_ => ({ git })),
  })
);

export default useGitCtx;