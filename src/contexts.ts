import { createContext } from 'react';
import { ModuleStore } from 'stores/ModuleStore';
import { TemporaryModuleStore } from 'stores/TemporaryModuleStore';

export const storeContext = createContext({
  moduleStore: new ModuleStore(),
  temporaryModuleStore: new TemporaryModuleStore(),
})
