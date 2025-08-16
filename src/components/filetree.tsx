import { Fragment, useState } from "react";
import "./filetree.css";
import Caret from "../icons/caret";
import { pathBits, sysFile } from "../utilities";
import { useLocation } from "react-router-dom";
import { useNavigation } from "../hooks/useNavigation";
import { TypesetAnchorResp } from "../types";
import useCanvasCtx from "../context/canvas";

type IFile = {
  type?: string;
  path?: string;
}

type FileTreeOps<T extends IFile> = {
  files: T[];
  activeFilePath?: string;
  open?: boolean;
  onFileClick: (file: T) => void;
  root?: string;
}

const EXT = "nat";

const stripExt = (str: string) => {
  let strBits = str.split(".");
  if (strBits[strBits.length - 1] === EXT)
    return strBits.slice(0, strBits.length - 1).join();
  return str;
};

const formatFile = (file: IFile, parent?: IFile) => {
  if (!file.path) throw new Error("Missing file path!");

  let formatted = file.path;

  if (parent) {
    if (!parent.path) throw new Error("Missing folder path!");
    formatted = formatted.replace(`${parent.path}/`, "");
  }

  formatted = stripExt(formatted);

  return formatted;
}

type MinMap = { [key: string]: boolean };

const FileTree = <T extends IFile,>({ onFileClick, open = false, files, activeFilePath, root }: FileTreeOps<T>) => {
  const canvasCtx = useCanvasCtx();
  const { navigate } = useNavigation();
  const location = useLocation();
  const [minMap, setMinMap] = useState<MinMap>(
    files.reduce((acc, file) => {
      if (!file.path) return acc;
      if (file.type === "tree")
        acc[file.path] = open || (activeFilePath ? pathBits(activeFilePath)[0] === file.path : false)
      return acc;
    }, {} as MinMap)
  );

  const toggle = (path: string) => setMinMap(minMap => ({ ...minMap, [path]: !minMap[path] }));
  const iconWidth = 15;
  const dirs: T[] = [];
  const qualify = (file: T) => root && file.path ? `${root}/${file.path}` : file.path!;

  let activeAnchor: TypesetAnchorResp | undefined;
  let anchors: Record<string, TypesetAnchorResp[]> = {};

  for (const file of files) {
    if (!file.path) continue;
    const path = qualify(file);
    const objs = canvasCtx.objects[path] ?? [];

    anchors[path] = [];
    for (const obj of objs) {
      if (obj.type !== "anchor") continue;
      anchors[path].push(obj);
      if (`/${root}/${activeFilePath}${location.hash}` === `${obj.out.path}#${obj.out.title}`)
        activeAnchor = obj;
    }
  }

  return files.filter(file => file.path && !sysFile(file.path)).map(file => {
    let parent = dirs[dirs.length - 1];

    if (file.type == "tree") {
      let isOpen = (file.path && minMap[file.path]);
      if (file?.path && !parent?.path?.includes(file.path))
        dirs.pop();
      dirs.push(file);

      return <div
        className={`FileTreeFolder ${!isOpen ? "FileTreeFolder--closed" : ""}`}
        key={file.path}
        onClick={() => file.path && toggle(file.path)}
      >
        <Caret className="icon" />
        <div className="FileTreeFileTitle">
          {file.path}
        </div>
      </div>;
    } else if (file.type == "blob") {
      if (file?.path && parent?.path && !file.path?.includes(parent.path))
        dirs.pop();
      else if (parent?.path && !minMap[parent.path])
        return undefined;

      const paddingLeft = iconWidth + dirs.length * 5;

      return <Fragment key={file.path}>
        <div
          className={`FileTreeFile ${!activeAnchor && activeFilePath === file.path ? "FileTreeFile--active" : ""}`}
          style={{ paddingLeft }}
          onClick={_ => {
            onFileClick(file)
          }}
        >
          <div className="FileTreeFileTitle">
            <span>{formatFile(file, parent)}</span>
          </div>
        </div>
        {(file.path ? anchors[qualify(file)] : []).map(
          anchor => <div
            className={`FileTreeAnchor ${activeAnchor && activeAnchor.out === anchor.out ? "FileTreeAnchor--active" : ""}`}
            style={{ paddingLeft: paddingLeft + 5 }}
            key={`${file.path}-${anchor.out.title}`}
            onClick={() => navigate(`${location.pathname === anchor.out.path ? "" : anchor.out.path}#${anchor.out.title}`)}
          >
            <div className="FileTreeAnchorTitle">
              <span>{anchor.out.title}</span>
            </div>
          </div>
        )}
      </Fragment >
    }
  });
};

export default FileTree;