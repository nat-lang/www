import { useState } from "react";
import "./filetree.css";
import Caret from "../icons/caret";
import { stripExt } from "../util";

type IFile = {
  type?: string;
  path?: string;
}

type FileTreeOps<T extends IFile> = {
  files: T[];
  activeFilePath?: string;
  open?: boolean;
  onFileClick: (file: T) => void;
}

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

const FileTree = <T extends IFile,>({ onFileClick, open = true, files, activeFilePath }: FileTreeOps<T>) => {
  const [minMap, setMinMap] = useState<MinMap>(
    files.reduce((acc, file) => {
      if (!file.path) return acc;
      if (file.type === "tree") acc[file.path] = open;
      return acc;
    }, {} as MinMap)
  );

  const toggle = (path: string) => setMinMap(minMap => ({ ...minMap, [path]: !minMap[path] }));

  return <>
    {(() => {
      let roots: T[] = [];

      return files.map(file => {
        let parent = roots[roots.length - 1];

        if (file.type == "tree") {
          let isOpen = file.path && minMap[file.path];
          if (file?.path && !parent?.path?.includes(file.path))
            roots.pop();
          roots.push(file);

          return <div
            className={`FileTreeFolder ${!isOpen ? "FileTreeFolder--closed" : ""}`}
            key={file.path}
            style={{ paddingLeft: roots.length }}
            onClick={() => file.path && toggle(file.path)}
          >
            <Caret className="icon" />
            <div className="FileTreeFileTitle">
              {file.path}
            </div>
          </div>;
        } else if (file.type == "blob") {
          if (file?.path && parent?.path && !file.path?.includes(parent.path))
            roots.pop();

          if (parent?.path && !minMap[parent.path])
            return <div key={file.path}></div>;

          return <div
            className={`FileTreeFile ${activeFilePath === file.path ? "FileTreeFile--active" : ""}`}
            key={file.path}
            style={{ paddingLeft: roots.length * 10 }}
            onClick={_ => onFileClick(file)}
          >
            <div className="FileTreeFileTitle">
              <span>{formatFile(file, parent)}</span>
            </div>
          </div>;
        }
      });
    })()}
  </>;
};

export default FileTree;