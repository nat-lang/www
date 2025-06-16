import { useState, useEffect, FunctionComponent } from 'react';
import * as monaco from 'monaco-editor';
import './library.css';
import { v4 } from 'uuid';
import Navigation from '../components/navigation';
import { useLocation, useNavigate } from 'react-router-dom';
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

type LibraryProps = {
  git: Git | null;
}

const Library: FunctionComponent<LibraryProps> = ({ git }) => {
  const [model, setModel] = useState<monaco.editor.ITextModel | null>(null);
  const navigate = useNavigate();
  const { lib: libFiles } = useFileCtx();
  const [canvasFile, setCanvasFile] = useState<string>();
  const [openFilePane, setOpenFilePane] = useState<boolean>(false);
  const { pathname } = useLocation();

  const handleEvaluateClick = async () => {
    const intptResp = await runtime.typeset(abs(pathname));

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
    const path = formPath(form);

    await git.commitFileChange(path, model.getValue(), LIB_REPO, import.meta.env.VITE_GITHUB_BRANCH);
    setOpenFilePane(false);
    navigate(`/${path}`);
  };

  useEffect(() => {
    if (!git) return;

    if (pathname === undefined) {
      const uid = v4();
      const uri = monaco.Uri.file(uid);
      const model = monaco.editor.createModel(`use prelude`, 'nat', uri);
      setModel(model);
      return;
    }

    const uri = monaco.Uri.file(pathname);
    const model = monaco.editor.getModel(uri);

    if (model) {
      setModel(model);
      return;
    }

    (async () => {
      const content = await git.getContent(LIB_REPO, pathname);
      const model = monaco.editor.createModel(content, 'nat', uri);

      setModel(model);
    })();
  }, [pathname, git]);

  return <>
    <Header>
      <Button onClick={handleSaveClick}>save</Button>
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
          onChange={value => runtime.setFile(pathname, value)}
        />}
        right={width => <Canvas file={canvasFile} style={{ width }} />}
      />

      {openFilePane && <FilePane onSubmit={handleSave} files={libFiles} path={pathname} />}
    </div>
  </>;
};

export default Library;