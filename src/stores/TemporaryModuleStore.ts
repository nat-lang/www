
import { makeAutoObservable } from 'mobx';
import { ID, Author, Module, Slug, UUID, TemporaryModule } from 'types';
import { fetchModule, fetchLanguageFile, updateLanguageFile,createModule } from 'api';
import { v4 as uuid } from 'uuid';
import { toPascalCase } from 'utils/string';
import { defaults } from 'lodash';
import { baseUri, fullUri } from 'utils/language-client';

const { assign } = Object;

export const temporaryModuleFactory = (): TemporaryModule => ({
  temp_id: uuid(),
  title: "",
  content: ""
})

export class TemporaryModuleStore {
  module: TemporaryModule | null = null

  constructor() {
    makeAutoObservable(this);
  }

  get baseUri () {
    return this.module ? baseUri(this.module.temp_id) : null;
  }

  get uri () {
    return this.module ? fullUri(this.module.temp_id) : null;
  }

  initModule () {
    this.module = temporaryModuleFactory();

    updateLanguageFile(this.baseUri as string, this.module.content);
  }

  updateModule = async (mod: Pick<TemporaryModule, "content"> & Partial<TemporaryModule>) => {
    if (!this.module || !this.baseUri) throw Error("Can't update a nonexistent temporary module!");

    await updateLanguageFile(this.baseUri, mod.content);
    this.module = assign(this.module, mod);
  }
}

