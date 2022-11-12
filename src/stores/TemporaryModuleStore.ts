
import { makeAutoObservable } from 'mobx';
import { ID, Author, Module, Slug, UUID, TemporaryModule } from 'types';
import { fetchModule, fetchModuleGrammar, updateModuleGrammar,createModule } from 'api';
import { v4 as uuid } from 'uuid';
import { toPascalCase } from 'utils/string';
import { defaults } from 'lodash';

const { values } = Object;

export const tempModuleURI = (module: TemporaryModule) => `${toPascalCase(module.temp_id)}.nl`;

export const temporaryModuleFactory = (): TemporaryModule => ({
  temp_id: uuid(),
  title: "",
  content: ""
})

export class TemporaryModuleStore {
  module: TemporaryModule = temporaryModuleFactory()

  constructor() {
    makeAutoObservable(this);
  }

  get uri () {
    return tempModuleURI(this.module);
  }
}

