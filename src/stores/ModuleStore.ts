
import { makeAutoObservable } from 'mobx';
import { Module, Slug, TemporaryModule, ModuleCreateValues } from 'types';
import { fetchModule, createModule, updateModuleFile, updateModule } from 'api';
import { v4 as uuid } from 'uuid';
import { toPascalCase } from 'utils/string';

const { assign } = Object;

export const moduleURI = (module: Module) => `${toPascalCase(module.slug)}.nl`;

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

  get uri () {
    return this.module ? moduleURI(this.module) : null;
  }

  fetchModule = async (moduleSlug: Slug) => {
    this.module = await fetchModule(moduleSlug);

    if (!this.module) throw new Error(`Module ${moduleSlug} not found!`);

    return this.module;
  }

  createModule = async (module: ModuleCreateValues) => {
    this.module = await createModule(module);
    return this.module;
  }

  updateModule = async (mod: Partial<Module>) => {
    if (!this.module) throw Error("Can't update a nonexistent module!");

    this.module = await updateModule({slug: this.module.slug, ...mod});
    return this.module;
  }
  
  updateModuleFile = async (mod: Pick<Module, "content"> & Partial<Module>) => {
    if (!this.uri || !this.module) throw Error("Can't update a nonexistent module!");
  
    await updateModuleFile(this.uri, mod.content);
    this.module = assign(this.module, mod);
  }
}

