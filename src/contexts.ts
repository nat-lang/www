import { createContext } from 'react';
import { ModuleStore } from 'stores/ModuleStore';
import { TemporaryModuleStore } from 'stores/TemporaryModuleStore';

export const storeContext = createContext({
  temporaryModuleStore: new TemporaryModuleStore(),
  moduleStore: new ModuleStore()
})
