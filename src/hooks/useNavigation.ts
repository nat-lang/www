
import { useNavigate } from 'react-router-dom';
import { v4 } from 'uuid';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

type CB = (path: string) => Promise<void>;

interface NavCtx {
  preNav: Record<string, CB>;
  addPreNav: (key: string, fn: CB) => void;
  delPreNav: (key: string) => void;
}
const useNavCtx = create<NavCtx>()(
  set => ({
    preNav: {},
    addPreNav: (key, fn) => set(state => ({ preNav: { [key]: fn, ...state.preNav } })),
    delPreNav: key => set(state => {
      delete state.preNav[key];
      return state;
    })
  }),
);

export const useNavigation = () => {
  const [preNav, addPreNav, delPreNav] = useNavCtx(useShallow(state => [state.preNav, state.addPreNav, state.delPreNav]));
  const navigate = useNavigate();
  const beforeNavigate = (fn: CB) => {
    const key = v4();
    addPreNav(key, fn);
    return () => delPreNav(key);
  }
  return {
    beforeNavigate,
    navigate: async (path: string) => {
      await Promise.all(Object.values(preNav).map(f => f(path)));
      navigate(path);
    }
  }
};