
import { makeAutoObservable } from 'mobx';
import { Module, Slug, TemporaryModule, ModuleCreateValues } from 'types';
import { fetchModule, createModule, updateModuleFile, updateModule, deleteModuleFile } from 'api';
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

  constructor() {
    makeAutoObservable(this);
  }

  get baseUri () {
    return this.module ? baseUri(this.module.slug) : null;
  }

  get uri () {
    return this.module ? fullUri(this.module.slug) : null;
  }

  fetchModule = async (moduleSlug: Slug) => {
    this.module = await fetchModule(moduleSlug);

    if (!this.module) throw new Error(`Module ${moduleSlug} not found!`);

    return this.module;
  }

  createModule = async (module: TemporaryModule) => {
    this.module = await createModule(module);
    updateModuleFile(this.baseUri as string, this.module.content);
    deleteModuleFile(baseUri(module.temp_id));
    return this.module;
  }

  updateModule = async (mod: Partial<Module>) => {
    if (!this.module) throw Error("Can't update a nonexistent module!");

    this.module = await updateModule({slug: this.module.slug, ...mod});
    return this.module;
  }
  
  updateModuleFile = async (mod: Pick<Module, "content"> & Partial<Module>) => {
    if (!this.baseUri || !this.module) throw Error("Can't update a nonexistent module!");
  
    await updateModuleFile(this.baseUri, mod.content);
    this.module = assign(this.module, mod);
  }
}

