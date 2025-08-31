import { useState, FunctionComponent } from 'react';
import Header from '../components/header';
import Button from '../components/button';
import Git from '../service/git';
import FilePane, { FilePaneFieldValues } from '../components/filepane';
import { useRuntime } from '../hooks/useRuntime';
import useCreateCtx from '../context/create';
import { useModel } from '../context/monaco';
import Page from '../components/page';

type CreateProps = {
  git: Git | null;
  onCreate: (path: string) => void;
  ctx: {
    content: string;
    path: string;
  }
}

const Create: FunctionComponent<CreateProps> = ({ git, onCreate }) => {
  const [openFilePane, setOpenFilePane] = useState<boolean>(false);
  const { doc: content, docPath: path } = useCreateCtx();
  const model = useModel(path, content);
  const { evaluate, evaluating, canEvaluate } = useRuntime();

  const handleSave = async (form: FilePaneFieldValues) => {
    if (!git) return;
    if (!model) return;

    await git.commitFileChange(form.path, model.getValue(), form.repo, import.meta.env.VITE_GITHUB_BRANCH);
    setOpenFilePane(false);

    onCreate(form.path);
  };

  return <>
    <Header>
      <Button onClick={() => setOpenFilePane(true)}>save</Button>
      <Button disabled={canEvaluate} onClick={() => path && evaluate(path)}>evaluate</Button>
    </Header>
    <Page evaluating={evaluating} fsPath={path} model={model} orientation="EO" />

    {openFilePane && <FilePane onSubmit={handleSave} repo={repo} />}
  </>;
};

export default Create;