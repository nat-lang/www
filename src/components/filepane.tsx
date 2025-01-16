
import { FunctionComponent, forwardRef, useState } from "react";
import "./filepane.css";
import { useForm } from 'react-hook-form';
import { RepoFile } from "../types";
import Field from "./field";
import Submission from "./submission";

export type FilePaneFieldValues = {
  filename: string;
  folder: string;
}

type FilePaneOps = {
  path?: string;
  files: RepoFile[];
  onSubmit: (form: FilePaneFieldValues) => Promise<void>;
}

const FilePane: FunctionComponent<FilePaneOps> = forwardRef(({ files, onSubmit, path }, ref) => {
  const pathBits = path?.split("/");
  const file = pathBits ? pathBits[pathBits.length - 1] : undefined;
  const folder = pathBits ? pathBits.slice(0, pathBits.length - 1).join() : undefined;

  const [inFlight, setInFlight] = useState<boolean>(false);
  const {
    register,
    handleSubmit: doSubmit,
    formState: { errors },
  } = useForm<FilePaneFieldValues>();

  const folders = files.filter(file => file.type === "tree");

  const handleSubmit = doSubmit(async data => {
    setInFlight(true);
    await onSubmit(data);
    setInFlight(false);
  });

  return (
    <form className="FilePane" onSubmit={handleSubmit}>
      {pathBits
        ? <Field inFlight={inFlight} {...register('filename', { required: true, value: file })} placeholder={file} disabled />
        : <Field inFlight={inFlight} {...register('filename', { required: true })} placeholder="filename" />
      }
      {errors.filename && <p>Filename name is required.</p>}
      <select className="Field" id="folder" {...register('folder', { value: folder })} defaultValue={undefined}>
        <option className="Field--placeholder" value={undefined}></option>
        {folders.map(folder => <option key={folder.sha} value={folder.path}>{folder.path}</option>)}
      </select>
      <Submission inFlight={inFlight} onClick={handleSubmit} />
    </form>
  )
});

export default FilePane;