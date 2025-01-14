
import { FunctionComponent } from "react";
import "./navigation.css";
import { RepoFile } from "../types";
import { CoreFile } from "../service/nat/client";
import FileTree from "./filetree";

type NavigationOps = {
  files: RepoFile[];
  coreFiles: CoreFile[];
  onFileClick: (file: RepoFile) => void;
  onCoreFileClick: (file: CoreFile) => void;
  className: string;
}

const Navigation: FunctionComponent<NavigationOps> = ({ onFileClick, onCoreFileClick, files, coreFiles, className }) => {
  return <div className={`Navigation ${className}`}>
    <FileTree files={files} onFileClick={onFileClick} />
    <FileTree files={coreFiles} onFileClick={onCoreFileClick} />
  </div>;
};

export default Navigation;