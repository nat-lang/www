import { ModuleRecordStore, ModuleType } from "interfaces/Module";
import { ID, UUID } from "types";
import { Document as PDF, Page as PDFPage } from 'react-pdf/dist/esm/entry.webpack5';

type ModuleOutputParams<K extends ID | UUID, MT extends ModuleType> = {
  store: ModuleRecordStore<K, MT>
}

export const ModuleOutput = <K extends ID | UUID, MT extends ModuleType>({
  store
}: ModuleOutputParams<K, MT>) => {

  return (
    <div className="module-output">
      {store.current && <PDF
        file={store.current.outputUri}
        key={store.current.version}
        onLoadError={(err) => console.log('ERR! ', err)}
        onSourceError={(err) => console.log('ERR! ', err)
      }>
        <PDFPage pageNumber={1} />
      </PDF>}
  </div>
  )
}