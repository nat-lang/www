import { FunctionComponent, useEffect, useRef, useState } from "react";
import * as monaco from 'monaco-editor';

type EditorProps = {
  model: monaco.editor.ITextModel | null;
  onChange: (text: string) => void;
  style?: React.CSSProperties;
  options?: monaco.editor.IEditorOptions;
  fitHeightToContent?: boolean;
}

const Editor: FunctionComponent<EditorProps> = ({ model, onChange, style, fitHeightToContent = false, options = {} }) => {
  const [editor, setEditor] = useState<monaco.editor.ICodeEditor | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    setEditor((editor) => {
      if (editor) return editor;
      if (!editorRef.current) return editor;

      const newEditor = monaco.editor.create(editorRef.current, {
        model: null,
        language: "nat",
        automaticLayout: true,
        minimap: { enabled: false },
        tabSize: 2,
        detectIndentation: false,
        ...options
      });

      return newEditor;
    });

    return () => editor?.dispose();
  }, [editorRef.current]);

  useEffect(() => {
    if (editor && model) {
      editor.setModel(model);
      if (fitHeightToContent) {
        setHeight(editor.getContentHeight() + 5);
      }
    }
  }, [editor, model]);

  useEffect(() => {
    if (!editor) return;

    const disposables = [
      editor.onDidChangeModelContent(_ => {
        onChange(editor.getValue());

        if (fitHeightToContent) {
          setHeight(editor.getContentHeight() + 5);
        }
      })
    ];

    return () => disposables.forEach(x => x.dispose());
  }, [editor, onChange]);

  return <div
    className="Monaco"
    ref={editorRef}
    style={height ? { height, ...style } : style}
  />;
};

export default Editor;