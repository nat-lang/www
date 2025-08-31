
import { FunctionComponent } from "react";
import "./navigation.css";
import { RepoFile } from "../types";
import { useParams } from "react-router-dom";
import { CORE_PATH } from "../config";
import useFileCtx from "../context/file";
import FileTree from "./filetree";
import { useNavigation } from "../hooks/useNavigation";
import FBlob from "./filetree/FBlob";
import FArray from "./filetree/FArray";


type NavigationProps = {
  className?: string;
  style?: React.CSSProperties;
}

const Navigation: FunctionComponent<NavigationProps> = (({ style, className = "" }) => {
  const { repo, core } = useFileCtx();

  // console.log(core);
  return <div className={`Navigation ${className}`} style={style}>
    {repo.map(node => {
      switch (node.type) {
        case "tree":
          return <div key={node.path} className="NavigationPane">
            <div className="NavigationSecTitle">{node.path}</div>
            <FArray nodes={node.children ?? []} depth={0} parent={node} />
          </div>
        case "blob":
          return <FBlob key={node.path} node={node} title={node.path} depth={0} />
      }
    })}

    <div className="NavigationPane">
      <div className="NavigationSecTitle">core</div>
      <FArray nodes={core} depth={0} parent={{ type: "tree", path: "core" }} />
    </div>
  </div>;
});

export default Navigation;