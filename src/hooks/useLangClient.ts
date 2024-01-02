import { MonacoLanguageClient, ShowDocumentRequest } from "monaco-languageclient";
import { ModuleStore } from "stores/ModuleStore";

export const useLangClient = (store: ModuleStore) => {

  const handleLangClientRegister = (client: MonacoLanguageClient) => {
    client.onRequest(ShowDocumentRequest.method, ({ uri }) => {
      const bits = uri.split("/"),
            base = bits[bits.length - 1];

      // store.setCurrentOutputUri(base);
      // store.incrCurrentOutputVersion();

      return { success: true };
    });
  };

  return {
    handleLangClientRegister
  }
}