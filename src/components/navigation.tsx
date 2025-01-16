
import { FunctionComponent, act } from "react";
import "./navigation.css";
import { RepoFile } from "../types";
import { CoreFile } from "../service/nat/client";
import FileTree from "./filetree";

type NavigationOps = {
  files: RepoFile[];
  activeFilePath?: string;
  coreFiles: CoreFile[];
  onFileClick: (file: RepoFile) => void;
  className: string;
}

const Navigation: FunctionComponent<NavigationOps> = ({ onFileClick, files, coreFiles, className, activeFilePath }) => {
  return <div className={`Navigation ${className}`}>
    {files.length && <FileTree files={files} onFileClick={onFileClick} activeFilePath={activeFilePath} />}
    {coreFiles.length && <FileTree files={coreFiles} onFileClick={onFileClick} open={false} activeFilePath={activeFilePath} />}
  </div>;
};

export default Navigation;