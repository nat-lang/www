import { UUID, Module, ModuleCreateValues } from 'types';
import { v4 as uuid } from 'uuid';
import * as api from 'api';
import { computed, makeObservable, observable } from "mobx";

export class ModuleRecordAccessError extends Error {
  constructor(id: UUID) {
    super(`No record for module with id: ${id}`);
  }
}

export class NoCurrentModuleError extends ModuleRecordAccessError {
  constructor() {
    super(`No current module!`);
  }
}

export class ModuleStore  {
  // The id of the focused module
  currentID: UUID | null = null;
  // The whole library
  modules: Record<UUID, Module>;

  constructor () {
    makeObservable(this, {
      currentID: observable,
      current: computed,
      modules: observable,
      moduleList: computed,
    });

    this.modules = {};
  }

  new() {
    const module = {
      id: uuid(),
      title: "untitled",
      content: "",
      slug: ""
    };

    this.modules[module.id] = module;
    this.currentID = module.id;

    return module;
  }


  get current () {
    if (!this.currentID) return undefined;
  
    return this.modules[this.currentID];
  }

  get moduleList (): Module[] {
    return Object.values(this.modules);
  }

  setCurrent = ( mod: Module) => {
    this.modules[mod.id] = mod;
    this.currentID = mod.id;
  }

  getMod = (id: UUID) => {
    const mod = this.modules[id];

    if (!mod) throw new ModuleRecordAccessError(id);

    return mod;
  }

  setMod = (mod: Module) => {
    this.modules[mod.id] = mod;
  }

  interpretModule = async (id: UUID) => {
    return api.interpretModule(id);
  }

  fetchModule = async (slug: string) => {
    const mod = await api.fetchModule(slug);

    this.modules[mod.id] = mod;

    return mod;
  }

  fetchModules = async () => {
    const modules = await api.listModules();

    this.modules = Object.fromEntries(
      modules.map((mod => [mod.id, mod]))
    );
  }

  /**
   * Turn a temporary (e.g. client side) module record into a permanent
   * (e.g. server side) record, create its language file, and delete the
   * language file for the temp rec.
   * @param tempRec The temporary record to persist.
   * @returns ModuleRecord
   */
  createModule = async (values: ModuleCreateValues) => {
    const module = await api.createModule(values);

    this.modules[module.id] = module;
    return module;
  }

  /**
   * Update fields on the current module and send the whole object
   * to the library server.
   * @param values Values to persist to the library server.
   */
  updateCurrentModule = async (content: string) => {
    if (!this.currentID) throw new NoCurrentModuleError();
    if (!this.modules[this.currentID]) throw new ModuleRecordAccessError(this.currentID);

    this.modules[this.currentID].content = content;

    return api.writeModule(this.modules[this.currentID]);
  }
}
