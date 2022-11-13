import BaseMonacoEditor, { ChangeHandler, monaco } from "react-monaco-editor";
import { useKey } from "react-use";
import { registerMonaco } from "utils/monaco";

/**
 * The library's implementation sets an explicit initial width that
 * prevents css from cascading.
 */
class MonacoEditor extends BaseMonacoEditor {
  render() {
    return (
      <div
        ref={this.assignRef}
        style={{ height: "calc(100vh - 50px)" }}
        className="react-monaco-editor-container"
      />
    );
  }
}

const getMonacoModel = (uri: string) => monaco.editor.getModel(
  monaco.Uri.parse(uri)
);

const createMonacoModel = (uri: string, initialValue: string) => monaco.editor.createModel(
  initialValue,
  "nat",
  monaco.Uri.parse(uri)
);

const getOrCreateMonacoModel = (uri: string, initialValue: string) =>
  getMonacoModel(uri) ?? createMonacoModel(uri, initialValue);

export type EditorProps = {
  content: string
  uri: string
  onSave?: (value: string) => any
  onChange?: (value: string) => any
}

const Editor: React.FC<EditorProps> = ({ content, uri, onSave, onChange }) => {
  const saveKeyFilter = (e: KeyboardEvent) => e.key === "s" && e.metaKey;

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
    <MonacoEditor
      width="100%"
      language="nat"
      editorWillMount={registerMonaco}
      options={{
        model: getOrCreateMonacoModel(uri, content),
        minimap: {
          enabled: false
        },
        automaticLayout: true
      }}
      onChange={onEditorChange}
    />
  );
};

export default Editor;