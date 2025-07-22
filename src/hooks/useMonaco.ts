import * as monaco from 'monaco-editor';
import { useEffect, useState } from "react";

export const useMonaco = (path: string | undefined, content: string | undefined) => {
  const [model, setModel] = useState<monaco.editor.ITextModel | null>(null);
  useEffect(() => {
    if (!path) return;
    if (!content) return;

    const uri = monaco.Uri.file(path);
    const model = monaco.editor.getModel(uri)
      ?? monaco.editor.createModel(content, 'nat', uri);

    setModel(model);
  }, [path, content]);
  return model;
};
