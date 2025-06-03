import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthCtx {
  token: string;
  setToken: (token: string) => void;
}
const useAuthCtx = create<AuthCtx>()(
  persist(
    (set) => ({
      token: "",
      setToken: token => set(_ => ({ token })),
    }),
    {
      name: 'auth',
    },
  ),
);

export default useAuthCtx;