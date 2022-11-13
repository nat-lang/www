
import { makeAutoObservable } from 'mobx';
import { ID, Author, Module, Slug, UUID, TemporaryModule } from 'types';
import { fetchModule, fetchModuleFile, updateModuleFile,createModule } from 'api';
import { v4 as uuid } from 'uuid';
import { toPascalCase } from 'utils/string';
import { defaults } from 'lodash';
import { fileUri } from 'utils/monaco';

const { assign } = Object;

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
    return fileUri(this.module.temp_id);
  }

  updateModule = async (mod: Pick<TemporaryModule, "content"> & Partial<TemporaryModule>) => {
    await updateModuleFile(this.uri, mod.content);
    this.module = assign(this.module, mod);
  }
}

