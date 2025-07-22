import * as monaco from 'monaco-editor';

const canvas = document.createElement("canvas")
const context = canvas.getContext("2d")


export const vw = (v: number) => `${v}vw`;
export const px2vw = (px: number) => (px / window.innerWidth) * 100;

export const getOrCreateMonacoModel = async (
  path: string, getContent: () => Promise<string>
) => {
  const uri = monaco.Uri.file(path);

  console.log("getting or setting", uri);
  const model = monaco.editor.getModel(uri);
  console.log("found", model);

  if (model) return model;
  const content = await getContent();

  return monaco.editor.createModel(content, 'nat', uri);
};

export const getTextDimensions = (text: string) => {
  if (!context) return { width: 5, height: 5 };
  context.font = "12pt Avenir, sans serif"

  return {
    height: context.measureText('M').width,
    width: context.measureText(text).width
  }
};

export const pathBits = (path: string) => {
  const bits = path.split("/");
  const file = bits[bits.length - 1];
  const folder = bits.slice(0, bits.length - 1).join();
  return [folder, file];
}