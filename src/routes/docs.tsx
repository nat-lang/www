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
import * as nls from '../service/nls/client';
import { abs } from '@nat-lang/nat';
import useAuthCtx from '../context/auth';
import { DOC_PATH } from '../config';
import Editor from '../components/editor';
import useFileCtx from '../context/file';
import Grid from '../components/grid';

type DocsProps = {
  git: Git | null;
}

const Docs: FunctionComponent<DocsProps> = ({ git }) => {
  const [model, setModel] = useState<monaco.editor.ITextModel | null>(null);
  const params = useParams();
  const navigate = useNavigate();
  const { docs: docFiles } = useFileCtx();
  const githubAuth = useAuthCtx(state => state.token);
  const [canvasFile, setCanvasFile] = useState<string>();
  const [openFilePane, setOpenFilePane] = useState<boolean>(false);
  const path = params["*"];

  const handleEvaluateClick = async () => {
    if (!path) return;

    const intptResp = await runtime.typeset(abs(`${DOC_PATH}/${path}`));

    if (intptResp.success) {
      const renderResp = await nls.render(intptResp.tex);
      if (renderResp.success && renderResp.pdf)
        setCanvasFile(renderResp.pdf);
      else if (renderResp.errors)
        console.log(renderResp.errors);
    } else {
      console.log(intptResp.errors);
    }
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
    if (!git) return;
    if (!path) return;

    const uri = monaco.Uri.file(path);
    const model = monaco.editor.getModel(uri);

    if (model) {
      setModel(model);
      return;
    }

    (async () => {
      const content = await git.getContent(DOC_REPO, path.replace(DOC_PATH, ""))
      const model = monaco.editor.createModel(content, 'nat', uri);

      setModel(model);
    })();
  }, [path, git]);

  return <>
    <Header>
      {githubAuth && <Button onClick={handleSaveClick}>save</Button>}
      <Button onClick={handleEvaluateClick}>evaluate</Button>
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
          onChange={value => runtime.setFile(`${DOC_PATH}/${path}`, value)}
        />}
        right={width => <Canvas file={canvasFile} style={{ width }} />}
      />

      {openFilePane && <FilePane onSubmit={handleSave} files={docFiles} path={path} />}
    </div>
  </>;
};

export default Docs;