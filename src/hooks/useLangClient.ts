import { ModuleRecordStore, ModuleType } from "interfaces/Module";
import { MonacoLanguageClient, ShowDocumentRequest } from "monaco-languageclient/.";
import { ID, UUID } from "types";

export const useLangClient = <K extends ID | UUID, MT extends ModuleType>(store: ModuleRecordStore<K, MT>) => {

  const handleLangClientRegister = (client: MonacoLanguageClient) => {
    client.onRequest(ShowDocumentRequest.method, ({ uri }) => {
      const bits = uri.split("/"),
            base = bits[bits.length - 1];
      console.log('setting output uri...', base);
      store.setCurrentOutputUri(base);
      store.incrCurrentOutputVersion();
      return { success: true };
    });
  };

  return {
    handleLangClientRegister
  }
}