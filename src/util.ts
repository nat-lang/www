
const EXT = "nat";

export const stripExt = (str: string) => {
  let strBits = str.split(".");
  if (strBits[strBits.length - 1] === EXT)
    return strBits.slice(0, strBits.length - 1).join();
  return str;
};

export const ensureExt = (str: string) => {
  let strBits = str.split(".");
  if (strBits[strBits.length - 1] !== EXT)
    return `${str}.${EXT}`;
  return str;
};