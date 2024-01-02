import { useLangClient } from "hooks/useLangClient"
import { debounce } from "lodash"
import { observer } from "mobx-react-lite"
import EditorField from "./forms/EditorField"
import { ModuleStore } from "stores/ModuleStore"
import { fullUri } from "utils/language-client"

type ModuleEditorParams= {
  store: ModuleStore
}

export const ModuleEditor = ({
  store
}: ModuleEditorParams) => {
  const { handleLangClientRegister } = useLangClient(store);

  const handleEditorChange = debounce((content: string) => {
    store.updateCurrentModule(content);
  }, 200);

  return (
    <div className="module-editor">
      {store.current && <EditorField
        key={fullUri(store.current.id)}
        name="content"
        content={store.current.content}
        uri={fullUri(store.current.id)}
        onChange={handleEditorChange}
        onLangClientRegister={handleLangClientRegister}
      />}
    </div>
  );
}

export default observer(ModuleEditor);