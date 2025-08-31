import { useState, useEffect, FunctionComponent } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Header from '../components/header';
import Button from '../components/button';
import Git from '../service/git';
import FilePane, { FilePaneFieldValues } from '../components/filepane';
import useAuthCtx from '../context/auth';
import { FileMap } from '../context/file';
import { useRuntime } from '../hooks/useRuntime';
import LoadingGear from '../icons/loadingGear';
import useCmdKeys from '../hooks/useCmdKeys';
import { useModel } from '../context/monaco';
import Page from '../components/page';
import useCanvasCtx from '../context/canvas';

type EditProps = {
  git: Git | null;
  fileMap: FileMap;
  onNew: () => void;
}

const Edit: FunctionComponent<EditProps> = ({ git, onNew, fileMap }) => {
  const path = useLocation().pathname;
  const githubAuth = useAuthCtx(state => state.token);
  const [openFilePane, setOpenFilePane] = useState<boolean>(false);

  console.log(path, fileMap);
  const model = useModel(path, fileMap[path]);
  const { evaluate, evaluating, rendering, canEvaluate } = useRuntime();
  const { objects } = useCanvasCtx();
  const [saving, setSaving] = useState(false);

  const save = async (form: FilePaneFieldValues) => {
    if (!git) return;
    if (!model) return;
    setSaving(true);
    await git.commitFileChange(form.path, model.getValue(), import.meta.env.VITE_GITHUB_BRANCH);
    setSaving(false);
  };

  const handleSave = async (form: FilePaneFieldValues) => {
    setOpenFilePane(false);
    await save(form);
  };

  useEffect(() => {
    if (!path) return;
    if (!canEvaluate) return;
    if (objects[path]) return;

    evaluate(path);
  }, [canEvaluate, path, objects[path]]);

  useCmdKeys({
    onS: () => {
      if (!path) return;
      save({ path });
    },
    onEnter: () => {
      path && canEvaluate && evaluate(path);
    }
  }, [path, save]);

  return <>
    <Header>
      {githubAuth && <Button disabled={saving} inflight={saving} className="SaveButton" onClick={() => setOpenFilePane(true)}>
        <LoadingGear />
        <div className="Button-text">save</div>
      </Button>}
      <Button disabled={!canEvaluate} inflight={evaluating || rendering} className="EvalButton" onClick={() => path && canEvaluate && evaluate(path)}>
        <LoadingGear />
        <div className="Button-text">evaluate</div>
      </Button>

      <Button onClick={onNew}>new</Button>
    </Header>
    <Page evaluating={evaluating} path={path} model={model} orientation="OE" />
    {openFilePane && <FilePane onSubmit={handleSave} path={path} />}
  </>;
};

export default Edit;