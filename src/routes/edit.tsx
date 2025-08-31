import { useState, useEffect, FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';
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
import { useNavigation } from '../hooks/useNavigation';
import useCanvasCtx from '../context/canvas';

type EditProps = {
  git: Git | null;
  fileMap: FileMap;
  onNew: () => void;
  fsRoot: string;
  relPath?: boolean;
}

const Edit: FunctionComponent<EditProps> = ({ git, fsRoot, onNew, fileMap, relPath = false }) => {
  const params = useParams();
  const { navigate } = useNavigation();
  const githubAuth = useAuthCtx(state => state.token);
  const [openFilePane, setOpenFilePane] = useState<boolean>(false);
  const path = params["*"];
  const fsPath = `${fsRoot}/${path}`;
  const model = useModel(fsPath, fileMap[fsPath]);
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
    navigate(relPath && path ? path : `/${fsPath}`);
  };

  useEffect(() => {
    if (!fsPath) return;
    if (!canEvaluate) return;
    if (objects[fsPath]) return;

    evaluate(fsPath);
  }, [canEvaluate, fsPath, objects[fsPath]]);

  useCmdKeys({
    onS: () => {
      if (!path) return;
      save({ path });
    },
    onEnter: () => {
      fsPath && canEvaluate && evaluate(fsPath);
    }
  }, [fsPath, save]);

  return <>
    <Header>
      {githubAuth && <Button disabled={saving} inflight={saving} className="SaveButton" onClick={() => setOpenFilePane(true)}>
        <LoadingGear />
        <div className="Button-text">save</div>
      </Button>}
      <Button disabled={!canEvaluate} inflight={evaluating || rendering} className="EvalButton" onClick={() => fsPath && canEvaluate && evaluate(fsPath)}>
        <LoadingGear />
        <div className="Button-text">evaluate</div>
      </Button>

      <Button onClick={onNew}>new</Button>
    </Header>
    <Page evaluating={evaluating} fsPath={fsPath} urlPath={relPath ? path : undefined} model={model} orientation="OE" />
    {openFilePane && <FilePane onSubmit={handleSave} path={path} />}
  </>;
};

export default Edit;