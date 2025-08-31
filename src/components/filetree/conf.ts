import { EXT } from "@nat-lang/nat";

export const iconWidth = 13;

const stripExt = (str: string) => {
  let strBits = str.split(".");
  if (strBits[strBits.length - 1] === EXT)
    return strBits.slice(0, strBits.length - 1).join();
  return str;
};


export const fmtTitle = (path: string, parentPath: string) => stripExt(path.replace(`${parentPath}/`, ""));