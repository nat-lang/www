import { useLangClient } from "hooks/useLangClient"
import { ModuleRecordStore, ModuleType } from "interfaces/Module"
import { debounce } from "lodash"
import { observer } from "mobx-react-lite"
import { ID, UUID } from "types"
import EditorField from "./forms/EditorField"

type ModuleEditorParams<K extends ID | UUID, MT extends ModuleType> = {
  store: ModuleRecordStore<K, MT>
}

const ModuleEditor = <K extends ID | UUID, MT extends ModuleType>({
  store
}: ModuleEditorParams<K, MT>) => {
  const { handleLangClientRegister } = useLangClient(store);

  const handleEditorChange = debounce((content: string) => {
    store.updateCurrentModLangFile({ content });
  }, 200);

  return (
    <div className="module-editor">
      {store.current && <EditorField
        key={store.current.uri}
        name="content"
        content={store.current.module.content}
        uri={store.current.uri}
        onChange={handleEditorChange}
        onLangClientRegister={handleLangClientRegister}
      />}
    </div>
  );
}

export default observer(ModuleEditor);