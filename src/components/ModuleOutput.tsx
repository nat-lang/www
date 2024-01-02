import { Document as PDF, Page as PDFPage } from 'react-pdf/dist/esm/entry.webpack5';
import { observer } from "mobx-react-lite";
import { ModuleStore } from "stores/ModuleStore";
import { fullUri } from 'utils/language-client';

type ModuleOutputParams = {
  store: ModuleStore;
}

const ModuleOutput = ({
  store
}: ModuleOutputParams) => {

  return (
    <div className="module-output">
      {store.current && <PDF
        file={fullUri(store.current.id)}
        onLoadError={(err) => console.log('PDF load err! ', err)}
        onSourceError={(err) => console.log('PDF source err! ', err)
      }>
        <PDFPage pageNumber={1} />
      </PDF>}
  </div>
  )
}

export default observer(ModuleOutput);