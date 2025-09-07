import { useState, useEffect, FunctionComponent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../../components/header';
import Button from '../../components/button';
import FilePane, { FilePaneFieldValues } from '../../components/filepane';
import useAuthCtx from '../../context/auth';
import { useRuntime } from '../../hooks/useRuntime';
import LoadingGear from '../../icons/loadingGear';
import useCmdKeys from '../../hooks/useCmdKeys';
import Page from '../../components/page';
import useCanvasCtx from '../../context/canvas';
import { trimPrefix } from '../../utilities';
import useGitCtx from '../../context/git';
import { editor } from 'monaco-editor';

type BaseEditProps = {
  model: editor.ITextModel | null;
}

const BaseEdit: FunctionComponent<BaseEditProps> = ({ model }) => {
  const { git } = useGitCtx();
  const path = useLocation().pathname;
  const githubAuth = useAuthCtx(state => state.token);
  const [openFilePane, setOpenFilePane] = useState<boolean>(false);
  const { evaluate, evaluating, rendering, canEvaluate } = useRuntime();
  const { objects } = useCanvasCtx();
  const [saving, setSaving] = useState(false);

  const save = async (form: FilePaneFieldValues) => {
    if (!git) return;
    if (!model) return;
    setSaving(true);
    await git.commitFileChange(trimPrefix(form.path, "/"), model.getValue(), import.meta.env.VITE_GITHUB_BRANCH);
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

      <Button><Link to="/new">new</Link></Button>
    </Header>
    <Page evaluating={evaluating} model={model} orientation="OE" />
    {openFilePane && <FilePane onSubmit={handleSave} path={path} />}
  </>;
};

export default BaseEdit;