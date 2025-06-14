
import { FunctionComponent, ReactNode } from "react";
import "./navigation.css";
import { RepoFile } from "../types";
import { useNavigate, useParams } from "react-router-dom";
import { DOC_PATH } from "../config";
import useFileCtx from "../context/file";
import FileTree from "./filetree";

type NavigationProps = {
  className?: string;
  style?: React.CSSProperties;
}

const Navigation: FunctionComponent<NavigationProps> = (({ style, className = "" }) => {
  const navigate = useNavigate();
  const params = useParams();
  const root = params.root;
  const path = params["*"] ? `${root}/${params["*"]}` : root;
  const { docs: docFiles, lib: libFiles, core: coreFiles } = useFileCtx();
  const handleFileClick = async (file: RepoFile) => {
    if (!file.path) throw Error("Can't navigate to pathless file.");

    navigate(`/${file.path}`);
  };

  const handleDocFileClick = async (file: RepoFile) => {
    if (!file.path) throw Error("Can't navigate to pathless file.");

    navigate(`/${DOC_PATH}/${file.path}`);
  };
  return <div className={`Navigation ${className}`} style={style}>
    <div className="NavigationPane">
      <div className="NavigationSecTitle">docs</div>
      {docFiles.length && <FileTree files={docFiles} onFileClick={handleDocFileClick} activeFilePath={path} />}
    </div>
    <div className="NavigationPane">
      <div className="NavigationSecTitle">library</div>
      {libFiles.length && <FileTree files={libFiles} onFileClick={handleFileClick} activeFilePath={path} />}
    </div>
    <div className="NavigationPane">
      <div className="NavigationSecTitle">core</div>
      {coreFiles.length && <FileTree files={coreFiles} onFileClick={handleFileClick} open={false} activeFilePath={path} />}
    </div>
  </div>;
});

export default Navigation;