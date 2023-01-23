import 'monaco-editor/esm/vs/editor/editor.all.js';

// support all editor features
import 'monaco-editor/esm/vs/editor/standalone/browser/accessibilityHelp/accessibilityHelp.js';
import 'monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens.js';
import 'monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard.js';
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneHelpQuickAccess.js';
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess.js';
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess.js';
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess.js';
import 'monaco-editor/esm/vs/editor/standalone/browser/quickInput/standaloneQuickInputService.js';
import 'monaco-editor/esm/vs/editor/standalone/browser/referenceSearch/standaloneReferenceSearch.js';
import 'monaco-editor/esm/vs/editor/standalone/browser/toggleHighContrast/toggleHighContrast.js';

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';

import { buildWorkerDefinition } from 'monaco-editor-workers';

import { MonacoLanguageClient, CloseAction, ErrorAction, MonacoServices, MessageTransports } from 'monaco-languageclient';
import { toSocket, WebSocketMessageReader, WebSocketMessageWriter } from 'vscode-ws-jsonrpc';
import normalizeUrl from 'normalize-url';
import { toPascalCase } from './string';

type Monaco = typeof import("monaco-editor/esm/vs/editor/editor.api");

let client: MonacoLanguageClient | null;

const NAT_LANG_ID = "nat";
const NAT_LANG_EXT = ".nl";

const getMonacoModel = (uri: string) => monaco.editor.getModel(
  monaco.Uri.parse(uri)
);

const createMonacoModel = (uri: string, initialValue: string) => monaco.editor.createModel(
  initialValue,
  NAT_LANG_ID,
  monaco.Uri.parse(uri)
);

const getOrCreateMonacoModel = (uri: string, initialValue: string) =>
  getMonacoModel(uri) ?? createMonacoModel(uri, initialValue);

const baseUri = (name: string) => `${toPascalCase(name)}${NAT_LANG_EXT}`;
const fullUri = (name: string) => `${process.env.REACT_APP_MODULE_DIR}/${baseUri(name)}`;

function createWsUrl(hostname: string, port: string, path: string): string {
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  return normalizeUrl(`${protocol}://${hostname}:${port}${path}`);
}

function createLanguageClient(
  transports: MessageTransports
): MonacoLanguageClient {
  return new MonacoLanguageClient({
    name: "Nat Language Client",
    clientOptions: {
      // use a language id as a document selector
      documentSelector: [NAT_LANG_ID],
      // disable the default error handler
      errorHandler: {
        error: () => ({ action: ErrorAction.Continue }),
        closed: () => ({ action: CloseAction.DoNotRestart })
      },
      diagnosticCollectionName: NAT_LANG_ID,
    },
    // create a language client connection from the JSON RPC connection on demand
    connectionProvider: {
      get: () => {
        return Promise.resolve(transports);
      }
    }
  });
}

const registerLanguageClient = (
  monaco: Monaco,
  cb?: (client: MonacoLanguageClient) => void
) => {
  buildWorkerDefinition('dist', new URL('', window.location.href).href, false);

  monaco.languages.register({
    id: NAT_LANG_ID,
    extensions: [NAT_LANG_EXT],
    aliases: [NAT_LANG_ID],
    mimetypes: ["application/json"],
  });

  MonacoServices.install();

  if (!process.env.REACT_APP_LANG_CLIENT_URL) return;

  const url = new URL(process.env.REACT_APP_LANG_CLIENT_URL);
  const wsUrl = createWsUrl(url.hostname, url.port, url.pathname);
  const webSocket = new WebSocket(wsUrl);

  webSocket.onopen = () => {
    const socket = toSocket(webSocket);
    const reader = new WebSocketMessageReader(socket);
    const writer = new WebSocketMessageWriter(socket);
    client = createLanguageClient({ reader, writer });
    client.start();
    reader.onClose(() => client?.stop());

    cb && cb(client);
  };
}

export {
  NAT_LANG_ID, NAT_LANG_EXT,
  getMonacoModel, getOrCreateMonacoModel,
  baseUri, fullUri,
  registerLanguageClient
}