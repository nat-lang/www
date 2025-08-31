
import { FunctionComponent } from "react";
import "./navigation.css";
import useFileCtx from "../context/file";
import FBlob from "./filetree/FBlob";
import FArray from "./filetree/FArray";
import { trimPrefix } from "../utilities";


type NavigationProps = {
  className?: string;
  style?: React.CSSProperties;
}

const Navigation: FunctionComponent<NavigationProps> = (({ style, className = "" }) => {
  const { repo, core } = useFileCtx();

  return <div className={`Navigation ${className}`} style={style}>
    {repo.map(node => {
      switch (node.type) {
        case "tree":
          return <div key={node.path} className="NavigationPane">
            <div className="NavigationSecTitle">{trimPrefix(node.path, "/")}</div>
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