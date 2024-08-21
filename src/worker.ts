import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

self.MonacoEnvironment = {
  getWorker(_: any, label: string) {
    switch (label) {
      case 'json':
        return new jsonWorker();
      case 'typescript':
        return new tsWorker();
      default:
        return new editorWorker();
    }
  }
};

monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);