import "./filetree.css";

type IFile = {
  type?: string;
  path?: string;
}

type FileTreeOps<T extends IFile> = {
  files: T[];
  onFileClick: (file: T) => void;
}

const formatFile = (file: IFile, parent?: IFile) => {
  if (!file.path) throw new Error("Missing file path!");

  let formatted = file.path;

  if (parent) {
    if (!parent.path) throw new Error("Missing folder path!");
    formatted = formatted.replace(`${parent.path}/`, "");
  }

  let formattedBits = formatted.split(".");
  if (formattedBits[formattedBits.length - 1] === "nat")
    return formattedBits.slice(0, formattedBits.length - 1).join();

  return formatted;
}

const FileTree = <T extends IFile,>({ onFileClick, files }: FileTreeOps<T>) => {
  return <>
    {(() => {
      let roots: T[] = [];

      return files.map((file, idx) => {
        let parent = roots[roots.length - 1];

        if (file.type == "tree") {
          if (file?.path && !parent?.path?.includes(file.path))
            roots.pop();
          roots.push(file);

          return <div
            className="FileTreeFolder"
            key={idx}
            style={{ paddingLeft: roots.length }}
          >
            <div className="FileTreeFileTitle">
              {file.path}
            </div>
          </div>;
        } else if (file.type == "blob") {
          return <div
            className="FileTreeFile"
            key={idx}
            style={{ paddingLeft: roots.length * 10 }}
            onClick={_ => onFileClick(file)}
          >
            <div className="FileTreeFileTitle">
              {formatFile(file, parent)}
            </div>
          </div>;
        }
      });
    })()}
  </>;
};

export default FileTree;