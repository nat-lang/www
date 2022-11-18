import { createContext } from 'react';
import { LanguageStore } from 'stores/LanguageStore';
import { ModuleStore } from 'stores/ModuleStore';
import { TemporaryModuleStore } from 'stores/TemporaryModuleStore';

export const storeContext = createContext({
  languageStore: new LanguageStore(),
  moduleStore: new ModuleStore(),
  temporaryModuleStore: new TemporaryModuleStore(),
})
