import { computed, makeObservable, observable, set } from "mobx";
import { ID, Module, TemporaryModule, UUID } from "types";
import * as api from 'api';
import { baseUri, fullUri } from "utils/language-client";

export class ModuleRecordAccessError extends Error {
  constructor(id: ID | UUID) {
    super(`No record for module with id: ${id}`);
  }
}

export class NoCurrentModuleError extends ModuleRecordAccessError {
  constructor() {
    super(`No current module!`);
  }
}

export type ModuleType = Module | TemporaryModule;

export abstract class BaseModuleRecord<T extends ModuleType> {
  module: T;
  version: number;
  outputUri?: string;

  constructor (mod: T, v: number = 0, oUri?: string) {
    this.module = mod;
    this.version = v;
    this.outputUri = oUri;
  }

  abstract get baseUri (): string
  abstract get uri (): string
}

export class ModuleRecord extends BaseModuleRecord<Module> {
  get baseUri () {
    return baseUri(this.module.slug);
  }
  get uri () {
    return fullUri(this.module.slug);
  }
}

export class TemporaryModuleRecord extends BaseModuleRecord<TemporaryModule> {
  get baseUri () {
    return baseUri(this.module.id);
  }
  get uri () {
    return fullUri(this.module.id);
  }
}

export type ModuleRecordMap<K extends number | string, MT extends ModuleType> = {[key in K]: BaseModuleRecord<MT>};

export abstract class ModuleRecordStore<K extends ID | UUID, MT extends ModuleType> {
  // The id of the focused module
  currentID: K | null = null
  // The whole library
  modules: ModuleRecordMap<K, MT> = {} as ModuleRecordMap<K, MT>;

  abstract recordFactory (mod: MT): BaseModuleRecord<MT>

  constructor () {
    makeObservable(this, {
      currentID: observable,
      modules: observable,
      current: computed,
      moduleList: computed,
    });
  }

  get current () {
    if (!this.currentID) return undefined;
  
    return this.modules[this.currentID];
  }

  get moduleList (): BaseModuleRecord<MT>[] {
    return Object.values(this.modules);
  }

  setCurrent = (id: K, mod: MT) => {
    const rec = this.setRec(id, mod);
    this.currentID = id;
    return rec;
  }

  getRec = (id: K) => {
    const rec = this.modules[id];

    if (!rec) throw new ModuleRecordAccessError(id);

    return rec;
  }

  setRec = (id: K, mod: MT) => {
    const rec = this.recordFactory(mod);

    this.modules[id] = rec;
    return rec;
  }

  setCurrentRecModule = (values: Partial<MT>) => {
    if (!this.currentID) throw new NoCurrentModuleError();

    return this.updateRecModule(this.currentID, values);
  }
  
  updateRec = (id: K, values: Partial<BaseModuleRecord<MT>>) => {
    const rec = this.getRec(id);
    set(this.modules, id, {...rec, ...values});
    return rec;
  }

  updateRecModule = (id: K, values: Partial<MT>) => {
    const rec = this.getRec(id);

    return this.updateRec(id, {
      ...rec,
      module: {...rec.module, ...values},
    });
  }

  setCurrentOutputUri = (base: string) => {
    if (!this.currentID) throw new NoCurrentModuleError();
    this.setOutputUri(this.currentID, base);
  }

  incrCurrentOutputVersion = () => {
    if (!this.currentID) throw new NoCurrentModuleError();
    this.incrOutputVersion(this.currentID);
  }

  setOutputUri = (id: K, base: string) => {
    this.updateRec(id, {
      outputUri: `${process.env.REACT_APP_LANG_CLIENT_URL}/static/${base}`,
    });
  }

  incrOutputVersion = (id: K) => {
    const rec = this.getRec(id);
    const version = rec.version + 1;

    this.updateRec(id, { version });
  }

  /**
   * Update fields of the module and send the content to the
   * language server.
   * @param values
   */
  updateCurrentModLangFile = async (values: Pick<MT, 'content'>) => {
    if (!this.currentID) throw new NoCurrentModuleError();

    // @ts-ignore
    const rec = this.updateRecModule(this.currentID, values);

    api.createOrUpdateLanguageFile(rec.baseUri, rec.module.content);
  }
}
