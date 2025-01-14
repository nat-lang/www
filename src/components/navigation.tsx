
import { FunctionComponent } from "react";
import "./navigation.css";
import { RepoFile } from "../types";
import { CoreFile } from "../service/nat/client";
import FileTree from "./filetree";

type NavigationOps = {
  files: RepoFile[];
  coreFiles: CoreFile[];
  onFileClick: (file: RepoFile) => void;
  className: string;
}

const Navigation: FunctionComponent<NavigationOps> = ({ onFileClick, files, coreFiles, className }) => {
  return <div className={`Navigation ${className}`}>
    {files.length && <FileTree files={files} onFileClick={onFileClick} />}
    {coreFiles.length && <FileTree files={coreFiles} onFileClick={onFileClick} open={false} />}
  </div>;
};

export default Navigation;