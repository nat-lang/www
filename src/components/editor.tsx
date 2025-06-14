import { FunctionComponent, useEffect, useRef, useState } from "react";
import * as monaco from 'monaco-editor';

type EditorProps = {
  model: monaco.editor.ITextModel | null;
  onChange: (text: string) => void;
  onKeyDown: (e: monaco.IKeyboardEvent) => void;
  style?: React.CSSProperties;
}

const Editor: FunctionComponent<EditorProps> = ({ model, onChange, onKeyDown, style }) => {
  const [editor, setEditor] = useState<monaco.editor.ICodeEditor | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
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
        detectIndentation: false
      });

      return newEditor;
    });

    return () => editor?.dispose();
  }, [editorRef.current]);

  useEffect(() => {
    if (editor && model)
      editor.setModel(model);

  }, [editor, model]);


  useEffect(() => {
    if (!editor) return;

    const disposables = [
      editor.onKeyDown(onKeyDown),
      editor.onDidChangeModelContent(_ => {
        onChange(editor.getValue());
      })
    ];

    return () => disposables.forEach(x => x.dispose());
  }, [editor, onKeyDown, onChange]);

  return <div
    className="Monaco"
    ref={editorRef}
    style={style}
  />;
};

export default Editor;