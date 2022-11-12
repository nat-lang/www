
import { makeAutoObservable } from 'mobx';
import { ID, Author, Module, Slug, UUID, TemporaryModule } from 'types';
import { fetchModule, fetchModuleGrammar, updateModuleGrammar,createModule } from 'api';
import { v4 as uuid } from 'uuid';
import { toPascalCase } from 'utils/string';
import { defaults } from 'lodash';

const { values } = Object;

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

  dispatchFetchModule = async (moduleSlug: Slug) => {
    this.module = await fetchModule(moduleSlug);

    if (!this.module) throw new Error(`Module ${moduleSlug} not found!`);

    return this.module;
  }

  dispatchCreateModule = async (tempModule: TemporaryModule) => {
    this.module = await createModule(tempModule);
    return this.module;
  }
}

