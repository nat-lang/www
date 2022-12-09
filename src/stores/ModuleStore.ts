import { makeAutoObservable } from 'mobx';
import { Module, Slug, TemporaryModule } from 'types';
import * as api from 'api';
import { v4 as uuid } from 'uuid';
import { baseUri, fullUri } from 'utils/language-client';

const { assign } = Object;

export const temporaryModuleFactory = (): TemporaryModule => ({
  temp_id: uuid(),
  title: "",
  content: ""
})

export class ModuleStore {
  module: Module | null = null
  outputUri: string | undefined

  constructor() {
    makeAutoObservable(this);
  }

  get baseUri () {
    return this.module ? baseUri(this.module.slug) : null;
  }

  get uri () {
    return this.module ? fullUri(this.module.slug) : null;
  }

  setOutputUri (base: string) {
    this.outputUri = `${process.env.REACT_APP_LANG_CLIENT_URL}/static/${base}`;
  }

  fetchModule = async (moduleSlug: Slug) => {
    this.module = await api.fetchModule(moduleSlug);

    if (!this.module) throw new Error(`Module ${moduleSlug} not found!`);

    return this.module;
  }

  createModule = async (module: TemporaryModule) => {
    this.module = await api.createModule(module);
    // create a new file on disk for the module and delete its temporary ancestor
    api.updateLanguageFile(this.baseUri as string, this.module.content);
    api.deleteLanguageFile(baseUri(module.temp_id));
    return this.module;
  }

  updateModule = async (values: Partial<Module>) => {
    if (!this.module) throw Error("Can't update a nonexistent module!");

    this.module = await api.updateModule({slug: this.module.slug, ...values});
    return this.module;
  }
  
  updateModuleFile = async (mod: Pick<Module, "content"> & Partial<Module>) => {
    if (!this.baseUri || !this.module) throw Error("Can't update a nonexistent module!");
  
    await api.updateLanguageFile(this.baseUri, mod.content);
    this.module = assign(this.module, mod);
  }
}
