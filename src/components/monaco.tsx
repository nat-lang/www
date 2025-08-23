import { FunctionComponent, useEffect, useRef, useState } from "react";
import * as monaco from 'monaco-editor';

type MonacoProps = {
  model: monaco.editor.ITextModel | null;
  style?: React.CSSProperties;
  options?: monaco.editor.IEditorOptions;
  fitHeightToContent?: boolean;
}

const Monaco: FunctionComponent<MonacoProps> = ({ model, style, fitHeightToContent = false, options = {} }) => {
  const [editor, setEditor] = useState<monaco.editor.ICodeEditor | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;
    setEditor((editor) => {
      if (editor) return editor;
      if (!editorRef.current) return null;

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

  const fitContentHeight = () => {
    if (!editor) return;

    if (fitHeightToContent) {
      setHeight(editor.getContentHeight() + 5);
    }
  };

  useEffect(() => {
    if (!editor) return;
    if (!model) return;

    editor.setModel(model);
    fitContentHeight();
  }, [editor, model]);

  useEffect(() => {
    if (!editor) return;

    const disposables = [
      editor.onDidChangeModelContent(fitContentHeight)
    ];

    return () => disposables.forEach(x => x.dispose());
  }, [editor, model]);

  return <div
    className={`Monaco ${model?.uri.path}`}
    ref={editorRef}
    style={height ? { height, ...style } : style}
  />;
};

export default Monaco;