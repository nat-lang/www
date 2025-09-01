import { EXT } from "@nat-lang/nat";
import { trimPrefix } from "../../utilities";

export const iconWidth = 13;

const stripExt = (str: string) => {
  let strBits = str.split(".");
  if (strBits[strBits.length - 1] === EXT)
    return strBits.slice(0, strBits.length - 1).join();
  return str;
};


export const fmtTitle = (path: string, parentPath: string) => {
  let formatted = path;

  formatted = path.replace(`${parentPath}/`, "");
  formatted = stripExt(formatted);
  formatted = trimPrefix(formatted, "/");

  return formatted;
} 