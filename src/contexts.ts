import { createContext } from 'react';
import { ModuleStore } from 'stores/ModuleStore';

export const storeContext = createContext({
  moduleStore: new ModuleStore(),
});
