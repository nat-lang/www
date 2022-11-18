import { useStores } from "hooks";
import { MonacoLanguageClient } from "monaco-languageclient/.";
import BaseMonacoEditor, { ChangeHandler } from "react-monaco-editor";
import { useKey } from "react-use";
import { getMonacoModel, getOrCreateMonacoModel, NAT_LANG_ID, registerLanguageClient } from "utils/language-client";


export type EditorProps = {
  content: string
  uri: string
  onSave?: (value: string) => any
  onChange?: (value: string) => any
  onLangClientRegister?: (client: MonacoLanguageClient) => void
}

const Editor: React.FC<EditorProps> = ({ content, uri, onSave, onChange, onLangClientRegister }) => {
  const saveKeyFilter = (e: KeyboardEvent) => e.key === "s" && e.metaKey;
  const {languageStore} = useStores();

  useKey(saveKeyFilter, (e: KeyboardEvent) => {
    const model = getMonacoModel(uri);
  
    if (!model) return;

    e.preventDefault();

    onSave && onSave(model.getValue());
  });

  const onEditorChange: ChangeHandler = (value) => {
    onChange && onChange (value);
  }

  return (
    <BaseMonacoEditor
      width="100%"
      height="calc(100vh - 50px)"
      language={NAT_LANG_ID}
      editorWillMount={(monaco) => {
        registerLanguageClient(monaco, onLangClientRegister)
      }}
      options={{
        model: getOrCreateMonacoModel(uri, content),
        minimap: {
          enabled: false
        },
        automaticLayout: true,
      }}
      onChange={onEditorChange}
    />
  );
};

export default Editor;