
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
    <div className="NavigationSecTitle">introduction</div>
    <div className="NavigationSecTitle">library</div>
    <div className="NavigationPane">
      {files.length && <FileTree files={files} onFileClick={onFileClick} activeFilePath={activeFilePath} />}
      <div className="NavigationSecTitle">core</div>
      {coreFiles.length && <FileTree files={coreFiles} onFileClick={onFileClick} open={false} activeFilePath={activeFilePath} />}
    </div>
  </div>;
});

export default Navigation;