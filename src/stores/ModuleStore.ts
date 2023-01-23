import { ID, Module, Slug } from 'types';
import * as api from 'api';
import { ModuleRecord, ModuleRecordStore, TemporaryModuleRecord } from 'interfaces/Module';

export class ModuleStore extends ModuleRecordStore<ID, Module> {
  recordFactory(mod: Module) {
    return new ModuleRecord(mod);
  }

  fetchModule = async (slug: Slug) => {
    const mod = await api.fetchModule(slug);

    return this.setCurrent(mod.id, mod);
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
   * @returns ModuleRecord
   */
  createModule = async (tempRec: TemporaryModuleRecord) => {
    const mod = await api.createModule(tempRec.module);
    const rec = this.setCurrent(mod.id, mod);

    await api.createOrUpdateLanguageFile(rec.baseUri(), rec.module.content);
    await api.deleteLanguageFile(tempRec.baseUri());

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

    return api.updateModule(rec.module);
  }
}
