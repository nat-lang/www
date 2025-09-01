import { FunctionComponent, useEffect, useState } from "react";
import { FileTree } from "../../context/file";
import Caret from "../../icons/caret";
import Array from "./array";
import { useLocation } from "react-router-dom";

type FileTreeNodeOps = {
  node: FileTree;
  title: string;
  open: boolean;
  depth: number;
  parent: FileTree;
}

const FileTreeNode: FunctionComponent<FileTreeNodeOps> = ({ node, title, depth, open: _open = false }) => {
  const location = useLocation();
  const [open, setOpen] = useState(_open);

  const onTitleClick = () => setOpen(!open);

  useEffect(() => {
    setOpen(location.pathname.startsWith(node.path));
  }, [location]);

  return <div className={`FileTreeFolder ${!open ? "FileTreeFolder--closed" : ""}`}>
    <div className="FileTreeFileTitle flex flex-align" onClick={onTitleClick}>
      <Caret className="icon" /> {title}
    </div>
    {open && <Array nodes={node.children ?? []} depth={depth + 1} parent={node} />}
  </div>
};

export default FileTreeNode;