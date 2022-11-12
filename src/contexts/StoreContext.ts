import { createContext } from 'react';
import { ModuleStore } from 'stores/ModuleStore';

export const StoreContext = createContext({
  moduleStore: new ModuleStore()
})
