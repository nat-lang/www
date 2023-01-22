import { makeAutoObservable } from 'mobx';
import { ID, Module, Slug } from 'types';
import * as api from 'api';
import { ModuleRecordStore, ModuleRecord, TemporaryModuleRecord } from 'interfaces/Module';

export class ModuleStore extends ModuleRecordStore<ID, Module> {
  constructor() {
    super();
    makeAutoObservable(this);
  }

  recordFactory(mod: Module) {
   return new ModuleRecord(mod);
  }

  modID(mod: Module): ID {
    return mod.id;
  }

  fetchModule = async (slug: Slug) => {
    const mod = await api.fetchModule(slug);

    this.setCurrent(mod.id, mod);
  }

  fetchModules = async () => {
    const modules = await api.listModules();
    this.modules = Object.fromEntries(
      modules.map((m => [m.id, new ModuleRecord(m)]))
    );
  }

  /**
   * Turn a temporary (e.g. client side) module record into a permanent
   * (e.g. server side) record, create its language file, and delete the
   * language file for the temp rec.
   * @param tempRec The temporary record to persist.
   */
  createModule = async (tempRec: TemporaryModuleRecord) => {
    const mod = await api.createModule(tempRec.module);
    const rec = this.setCurrent(mod.id, mod);

    api.createOrUpdateLanguageFile(rec.baseUri, rec.module.content);
    api.deleteLanguageFile(tempRec.baseUri);

    return rec;
  }

  /**
   * Update fields on the current module and send the whole object
   * to the library server.
   * @param values Values to persist to the library server.
   */
  updateCurrent = async (values: Partial<Module>) => {
    if (!this.currentID) throw Error("Can't update a nonexistent module!");

    const rec = this.updateRecModule(this.currentID, values);

    api.updateModule(rec.module);
  }
}
