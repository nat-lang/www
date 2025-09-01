import { useState, FunctionComponent } from 'react';
import Header from '../components/header';
import Button from '../components/button';
import FilePane, { FilePaneFieldValues } from '../components/filepane';
import { useRuntime } from '../hooks/useRuntime';
import useCreateCtx from '../context/create';
import { useModel } from '../context/monaco';
import Page from '../components/page';
import { useNavigate } from 'react-router-dom';
import useGitCtx from '../context/git';

type CreateProps = {}

const Create: FunctionComponent<CreateProps> = () => {
  const { git } = useGitCtx();
  const navigate = useNavigate();
  const [openFilePane, setOpenFilePane] = useState<boolean>(false);
  const { content, path } = useCreateCtx();
  const model = useModel(path, content);
  const { evaluate, evaluating, canEvaluate } = useRuntime();
  console.log(canEvaluate);
  const handleSave = async (form: FilePaneFieldValues) => {
    if (!git) return;
    if (!model) return;

    await git.commitFileChange(form.path, model.getValue(), import.meta.env.VITE_GITHUB_BRANCH);
    setOpenFilePane(false);
    navigate(form.path);
  };

  return <>
    <Header>
      <Button onClick={() => setOpenFilePane(true)}>save</Button>
      <Button disabled={!canEvaluate} onClick={() => path && evaluate(path)}>evaluate</Button>
    </Header>
    <Page evaluating={evaluating} model={model} orientation="EO" />

    {openFilePane && <FilePane onSubmit={handleSave} />}
  </>;
};

export default Create;