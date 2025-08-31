
import { FunctionComponent, useState } from "react";
import "./filepane.css";
import { useForm } from 'react-hook-form';
import Field from "./field";
import Submission from "./submission";
import { pathBits } from "../utilities";

export type FilePaneFieldValues = {
  path: string;
}

type FilePaneOps = {
  path?: string;
  onSubmit: (form: FilePaneFieldValues) => Promise<void>;
}

const FilePane: FunctionComponent<FilePaneOps> = ({ onSubmit, path }) => {
  const [_, file] = path ? pathBits(path) : [undefined, undefined];

  const [inFlight, setInFlight] = useState<boolean>(false);
  const {
    register,
    handleSubmit: doSubmit,
    formState: { errors },
  } = useForm<FilePaneFieldValues>();

  const handleSubmit = doSubmit(async data => {
    setInFlight(true);
    await onSubmit(data);
    setInFlight(false);
  });

  return (
    <form className="FilePane" onSubmit={handleSubmit}>
      {path
        ? <Field inFlight={inFlight} {...register('path', { required: true, value: file })} placeholder={file} disabled />
        : <Field inFlight={inFlight} {...register('path', { required: true })} placeholder="filename" />
      }
      {errors.path && <p>Filename name is required.</p>}
      {/*<select className="Field" id="repo" {...register('repo', { value: repo })} defaultValue={repo}>
        <option value={DOC_REPO}>guide</option>
        <option value={LIB_REPO}>library</option>
    </select>*/}
      <Submission inFlight={inFlight} onClick={handleSubmit} />
    </form>
  )
};

export default FilePane;