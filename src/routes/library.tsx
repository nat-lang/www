import { useState, useEffect, FunctionComponent } from 'react';
import * as monaco from 'monaco-editor';
import './library.css';
import { v4 } from 'uuid';
import Navigation from '../components/navigation';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import runtime from '../service/nat/client';
import Header from '../components/header';
import Button from '../components/button';
import Canvas from '../components/canvas';
import Git, { LIB_REPO } from '../service/git';
import FilePane, { FilePaneFieldValues } from '../components/filepane';
import * as nls from '../service/nls/client';
import { abs } from '@nat-lang/nat';
import Editor from '../components/editor';
import useFileCtx from '../context/file';
import Grid from '../components/grid';
import { evaluate } from '../service/eval';

type LibraryProps = {
  git: Git | null;
}

const Library: FunctionComponent<LibraryProps> = ({ git }) => {
  const [model, setModel] = useState<monaco.editor.ITextModel | null>(null);
  const navigate = useNavigate();
  const { libTree, lib } = useFileCtx();
  const [canvasFile, setCanvasFile] = useState<string>();
  const [openFilePane, setOpenFilePane] = useState<boolean>(false);
  const params = useParams();
  const path = params["*"];
  const content = useFileCtx(state => path ? state.lib[path] : undefined);

  const handleEvaluate = async () => {
    if (!path) return;

    const pdf = await evaluate(abs(path));

    if (pdf)
      setCanvasFile(pdf);
  };

  const formPath = (form: FilePaneFieldValues) => form.folder ? `${form.folder}/${form.filename}` : form.filename;

  const handleSave = async (form: FilePaneFieldValues) => {
    if (!git) return;
    if (!model) return;
    const path = formPath(form);

    await git.commitFileChange(path, model.getValue(), LIB_REPO, import.meta.env.VITE_GITHUB_BRANCH);
    setOpenFilePane(false);
    navigate(`/${path}`);
  };

  useEffect(() => {
    if (!path) return;
    if (!content) return;

    const uri = monaco.Uri.file(path);
    const model = monaco.editor.getModel(uri)
      ?? monaco.editor.createModel(content, 'nat', uri);

    setModel(model);
  }, [path, content]);

  return <>
    <Header>
      <Button onClick={() => setOpenFilePane(true)}>save</Button>
      <Button onClick={handleEvaluate}>evaluate</Button>
    </Header>
    <div className="Editor">
      <Grid
        initialDims={{
          left: 15,
          center: 55,
          right: 30
        }}
        left={width => <Navigation style={{ flexBasis: width }} />}
        center={width => <Editor model={model} style={{ width }}
          onChange={value => path && runtime.setFile(path, value)}
        />}
        right={width => <Canvas file={canvasFile} style={{ width }} />}
      />

      {openFilePane && <FilePane onSubmit={handleSave} files={libTree} path={path} />}
    </div>
  </>;
};

export default Library;