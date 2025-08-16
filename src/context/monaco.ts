import { create } from 'zustand';
import * as monaco from 'monaco-editor';
import { useEffect } from 'react';
import runtime from '../service/nat/client';

interface ModelCtx {
  models: Record<string, monaco.editor.ITextModel>
  setModel: (path: string, model: monaco.editor.ITextModel) => void
  delModel: (path: string) => void;
}

const useModelCtx = create<ModelCtx>()(set => ({
  models: {},
  setModel: (path, model) => set(({ models }) => {
    models[path] = model;
    return { models };
  }),
  delModel: (path) => {
    set(({ models }) => {
      const model = models[path];
      model.dispose();
      delete models[path];
      return { models };
    })
  }
}));

export const createModel = (path: string, content: string, onDidChangeContent = () => { }) => {
  const uri = monaco.Uri.file(path);
  const model = monaco.editor.createModel(content, 'nat', uri);
  model.onDidChangeContent(_ => {
    const v = model.getValue();
    runtime.setFile(path, v);
    onDidChangeContent();
  });
  return model;
};

export const useModel = (path: string | undefined, content: string | undefined) => {
  const { models, setModel } = useModelCtx();
  const model = path ? models[path] : null;

  useEffect(() => {
    if (!path) return;
    if (!content) return;
    if (!model)
      setModel(path, createModel(path, content));
  }, [model, content, path]);

  return model;
};


export default useModelCtx;