import { useState, useEffect, FunctionComponent } from 'react';
import * as monaco from 'monaco-editor';
import './library.css';
import Navigation from '../components/navigation';
import { useNavigate, useParams } from 'react-router-dom';
import runtime from '../service/nat/client';
import Header from '../components/header';
import Button from '../components/button';
import Canvas from '../components/canvas';
import Git, { DOC_REPO } from '../service/git';
import FilePane, { FilePaneFieldValues } from '../components/filepane';
import { abs } from '@nat-lang/nat';
import useAuthCtx from '../context/auth';
import { DOC_PATH } from '../config';
import Editor from '../components/editor';
import useFileCtx from '../context/file';
import Grid from '../components/grid';
import { evaluate } from '../service/eval';

type DocsProps = {
  git: Git | null;
}

const Docs: FunctionComponent<DocsProps> = ({ git }) => {
  const [model, setModel] = useState<monaco.editor.ITextModel | null>(null);
  const params = useParams();
  const navigate = useNavigate();
  const { docTree, docsLoaded, libLoaded, docs } = useFileCtx();
  const githubAuth = useAuthCtx(state => state.token);
  const [canvasFile, setCanvasFile] = useState<string>();
  const [openFilePane, setOpenFilePane] = useState<boolean>(false);
  const path = params["*"];
  const content = useFileCtx(state => state.docs[`${DOC_PATH}/${path}`]);

  const handleEvaluate = async () => {
    if (!path) return;

    const pdf = await evaluate(abs(`${DOC_PATH}/${path}`));

    if (pdf)
      setCanvasFile(pdf);
  };

  const handleSaveClick = () => setOpenFilePane(true);

  const formPath = (form: FilePaneFieldValues) => form.folder ? `${form.folder}/${form.filename}` : form.filename;

  const handleSave = async (form: FilePaneFieldValues) => {
    if (!git) return;
    if (!model) return;
    const path = formPath(form).replace(`${DOC_PATH}/`, "");
    await git.commitFileChange(path, model.getValue(), DOC_REPO, import.meta.env.VITE_GITHUB_BRANCH);
    setOpenFilePane(false);
    navigate(`/${DOC_PATH}/${path}`);
  };

  useEffect(() => {
    if (!path) return;
    if (!content) return;

    const uri = monaco.Uri.file(path);
    const model = monaco.editor.getModel(uri)
      ?? monaco.editor.createModel(content, 'nat', uri);

    setModel(model);
  }, [path, content]);

  useEffect(() => {
    if (docsLoaded && libLoaded)
      handleEvaluate();
  }, [docsLoaded, libLoaded])

  return <>
    <Header>
      {githubAuth && <Button onClick={handleSaveClick}>save</Button>}
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
        center={width => <Canvas file={canvasFile} style={{ width }} initialScale={1.5} />}
        right={width => <Editor model={model} style={{ width }}
          onChange={value => runtime.setFile(`${DOC_PATH}/${path}`, value)}
        />}
      />

      {openFilePane && <FilePane onSubmit={handleSave} files={docTree} path={path} />}
    </div>
  </>;
};

export default Docs;