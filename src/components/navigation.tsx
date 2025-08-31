
import { FunctionComponent } from "react";
import "./navigation.css";
import { RepoFile, RepoFileTree } from "../types";
import { useParams } from "react-router-dom";
import { CORE_PATH, DOC_PATH, LIB_PATH } from "../config";
import useFileCtx, { Tree } from "../context/file";
import FileTree from "./filetree";
import FTree from "./filetree/FTree";
import { useNavigation } from "../hooks/useNavigation";
import FBlob from "./filetree/FBlob";
import FArray from "./filetree/FArray";
import { fmtTitle } from "./filetree/conf";


type NavigationProps = {
  className?: string;
  style?: React.CSSProperties;
}

const Navigation: FunctionComponent<NavigationProps> = (({ style, className = "" }) => {
  const params = useParams();
  const path = params["*"];
  const { repo, core } = useFileCtx();
  const { navigate } = useNavigation();

  const onFileClick = (fn: (file: RepoFile) => string) => (file: RepoFile) => {
    if (!file.path)
      throw Error(`Missing path for file ${file}`);
    navigate(fn(file));
  };

  return <div className={`Navigation ${className}`} style={style}>
    {repo.map(node => {
      switch (node.type) {
        case "tree": {
          return <div className="NavigationPane">
            <div className="NavigationSecTitle">{node.path}</div>
            <FArray nodes={node.children ?? []} depth={0} parent={node} />
          </div>
        }
        case "blob":
          return <FBlob title={node.path} depth={0} />
      }
    })}

    <div className="NavigationPane">
      <div className="NavigationSecTitle">core</div>
      {core.length && <FileTree
        activeFilePath={path}
        files={core}
        onFileClick={onFileClick(file => `/${CORE_PATH}/${file.path}`)}
        open={false}
      />}
    </div>
  </div>;
});

export default Navigation;