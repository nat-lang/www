
import { forwardRef } from "react";
import "./navigation.css";
import { RepoFile } from "../types";
import { CoreFile } from "../service/nat/client";
import FileTree from "./filetree";

type NavigationOps = {
  files: RepoFile[];
  activeFilePath?: string;
  coreFiles: CoreFile[];
  onFileClick: (file: RepoFile) => void;
  className?: string;
  style?: React.CSSProperties;
}

const Navigation = forwardRef<HTMLDivElement, NavigationOps>(({ onFileClick, files, coreFiles, activeFilePath, style, className = "" }, ref) => {
  return <div ref={ref} className={`Navigation ${className}`} style={style}>
    {files.length && <FileTree files={files} onFileClick={onFileClick} activeFilePath={activeFilePath} />}
    {coreFiles.length && <FileTree files={coreFiles} onFileClick={onFileClick} open={false} activeFilePath={activeFilePath} />}
  </div>;
});

export default Navigation;