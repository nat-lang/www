
import { TemporaryModule, UUID } from 'types';
import { v4 as uuid } from 'uuid';
import { ModuleRecordStore, TemporaryModuleRecord } from 'interfaces/Module';

const tempModuleFactory = (mod: Partial<TemporaryModule> = {}) => ({
  ...mod,
  id: uuid(),
  title: "untitled",
  content: ""
});

export class TemporaryModuleStore extends ModuleRecordStore<UUID, TemporaryModule> {

  recordFactory(mod: TemporaryModule) {
    return new TemporaryModuleRecord(mod);
   }

  initCurrent (values: Partial<TemporaryModule> = {}) {
    const mod = tempModuleFactory(values),
          rec = this.setCurrent(mod.id, mod);

    this.updateCurrentModLangFile(rec.module);
    return rec;
  }
}

