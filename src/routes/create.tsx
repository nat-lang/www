import { useState, FunctionComponent, useEffect } from 'react';
import Header from '../components/header';
import Button from '../components/button';
import FilePane, { FilePaneFieldValues } from '../components/filepane';
import { useRuntime } from '../hooks/useRuntime';
import useCreateCtx from '../context/create';
import useModelCtx, { createModel } from '../context/monaco';
import Page from '../components/page';
import { useNavigate } from 'react-router-dom';
import useGitCtx from '../context/git';

type CreateProps = {}

const Create: FunctionComponent<CreateProps> = () => {
  const { git } = useGitCtx();
  const navigate = useNavigate();
  const [openFilePane, setOpenFilePane] = useState<boolean>(false);
  const { content, path, setContent } = useCreateCtx();
  const { models, setModel, delModel } = useModelCtx();
  const model = path ? models[path] : null;
  const { evaluate, evaluating, canEvaluate } = useRuntime();
  const handleSave = async (form: FilePaneFieldValues) => {
    if (!git) return;
    if (!model) return;

    await git.commitFileChange(form.path, model.getValue(), import.meta.env.VITE_GITHUB_BRANCH);
    setOpenFilePane(false);
    navigate(form.path);
  };

  useEffect(() => {
    const model = createModel(path, content, setContent);
    model.setValue(content);
    setModel(path, model);
    return () => delModel(path);
  }, []);

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