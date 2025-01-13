
import { FunctionComponent } from "react";
import "./navigation.css";
import { RepoFile } from "../types";

type NavigationOps = {
  files: RepoFile[];
  onFileClick: (file: RepoFile) => any;
  className: string;
}

const Navigation: FunctionComponent<NavigationOps> = ({ onFileClick, files, className }) => {
  return <div className={`Navigation ${className}`}>
    {(() => {
      let roots: RepoFile[] = [];

      return files.map((file, idx) => {
        let parent = roots[roots.length - 1];

        if (file.type == "tree") {
          if (file?.path && !parent?.path?.includes(file.path))
            roots.pop();
          roots.push(file);

          return <div
            className="NavigationFolder"
            key={idx}
            style={{ paddingLeft: roots.length }}
          >
            <div className="NavigationFileTitle">
              {file.path}
            </div>
          </div>;
        } else if (file.type == "blob") {
          return <div
            className="NavigationFile"
            key={idx}
            style={{ paddingLeft: roots.length * 10 }}
            onClick={_ => onFileClick(file)}
          >
            <div className="NavigationFileTitle">
              {parent?.path && file.path ? file.path.replace(`${parent.path}/`, "") : file.path}
            </div>
          </div>;
        }
      });
    })()}
  </div>;
};

export default Navigation;