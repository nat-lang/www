
import { FunctionComponent } from "react";
import "./navigation.css";
import { RepoFile } from "../types";
import { useParams } from "react-router-dom";
import { CORE_PATH, DOC_PATH, LIB_PATH } from "../config";
import useFileCtx from "../context/file";
import FileTree from "./filetree";
import { useNavigation } from "../hooks/useNavigation";


type NavigationProps = {
  className?: string;
  style?: React.CSSProperties;
}

const Navigation: FunctionComponent<NavigationProps> = (({ style, className = "" }) => {

  const params = useParams();
  const path = params["*"];
  const { docTree, libTree, coreTree } = useFileCtx();
  const { navigate } = useNavigation();

  const onFileClick = (fn: (file: RepoFile) => string) => (file: RepoFile) => {
    if (!file.path)
      throw Error(`Missing path for file ${file}`);
    navigate(fn(file));
  }

  return <div className={`Navigation ${className}`} style={style}>
    <div className="NavigationPane">
      <div className="NavigationSecTitle">guide</div>
      {docTree.length && <FileTree
        activeFilePath={path}
        files={docTree}
        onFileClick={onFileClick(file => `/${DOC_PATH}/${file.path}`)}
        root={DOC_PATH}
      />}
    </div>
    <div className="NavigationPane">
      <div className="NavigationSecTitle">library</div>
      {libTree.length && <FileTree
        activeFilePath={path}
        files={libTree}
        onFileClick={onFileClick(file => `/${file.path}`)}
        root={LIB_PATH}
      />}
    </div>
    <div className="NavigationPane">
      <div className="NavigationSecTitle">core</div>
      {coreTree.length && <FileTree
        activeFilePath={path}
        files={coreTree}
        onFileClick={onFileClick(file => `/${CORE_PATH}/${file.path}`)}
        open={false}
      />}
    </div>
  </div>;
});

export default Navigation;