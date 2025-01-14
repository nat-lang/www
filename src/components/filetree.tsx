
type IFile = {
  type?: string;
  path?: string
}

type FileTreeOps<T extends IFile> = {
  files: T[];
  onFileClick: (file: T) => void;
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
              {parent?.path && file.path ? file.path.replace(`${parent.path}/`, "") : file.path}
            </div>
          </div>;
        }
      });
    })()}
  </>;
};

export default FileTree;