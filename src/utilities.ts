
export const vw = (v: number) => `${v}vw`;
export const px2vw = (px: number) => (px / window.innerWidth) * 100;
export const vw2px = (vw: number) => (vw * window.innerWidth) / 100
export const pt2px = (pt: number) => pt * (96 / 72);
export const px2pt = (px: number) => px * (72 / 96);

export const getTextDimensions = (text: string) => {
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")

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
  const folder = bits.slice(0, bits.length - 1).join("/");
  return [folder, file];
};

export const sysFile = (path: string) => path.length > 0 && path[0] === ".";

export const sortObjs = <T extends { order: number }>(objs: T[]) => objs.sort((a, b) => a.order > b.order ? 1 : -1);