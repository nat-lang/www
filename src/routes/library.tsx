import { useState, useEffect, FunctionComponent } from 'react';
import * as monaco from 'monaco-editor';
import './library.css';
import { v4 } from 'uuid';
import Navigation from '../components/navigation';
import { useNavigate, useParams } from 'react-router-dom';
import runtime, { CORE_DIR } from '../service/nat/client';
import Header from '../components/header';
import Button from '../components/button';
import Canvas from '../components/canvas';
import Git, { DOC_REPO, LIB_REPO } from '../service/git';
import FilePane, { FilePaneFieldValues } from '../components/filepane';
import * as nls from '../service/nls/client';
import { abs } from '@nat-lang/nat';
import useAuthCtx from '../context/auth';
import { DOC_PATH } from '../config';
import Editor from '../components/editor';
import useFileCtx from '../context/file';
import Grid from '../components/grid';

type LibraryProps = {
  git: Git | null;
}

const Library: FunctionComponent<LibraryProps> = ({ git }) => {
  const [model, setModel] = useState<monaco.editor.ITextModel | null>(null);

  const params = useParams();
  const navigate = useNavigate();

  const { lib: libFiles } = useFileCtx();

  const githubAuth = useAuthCtx(state => state.token);
  const [canvasFile, setCanvasFile] = useState<string>();
  const [openFilePane, setOpenFilePane] = useState<boolean>(false);

  let root = params.root;
  let path = params["*"] ? `${root}/${params["*"]}` : root;

  const handleEvaluateClick = async () => {
    const intptResp = await runtime.typeset(path ? abs(path) : "/");

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

  const handleSave = async (repo: string, path: string) => {
    if (!git) return;
    if (!model) return;

    await git.commitFileChange(path, model.getValue(), repo, import.meta.env.VITE_GITHUB_BRANCH);
    setOpenFilePane(false);
  };

  const formPath = (form: FilePaneFieldValues) => form.folder ? `${form.folder}/${form.filename}` : form.filename;

  const handleDocSave = async (form: FilePaneFieldValues) => {
    const path = formPath(form).replace(`${DOC_PATH}/`, "");
    await handleSave(DOC_REPO, path);
    navigate(`/${DOC_PATH}/${path}`);
  };

  const handleLibSave = async (form: FilePaneFieldValues) => {
    const path = formPath(form);
    await handleSave(LIB_REPO, path);
    navigate(`/${path}`);
  };

  useEffect(() => {
    if (!git) return;

    if (path === undefined) {
      const uid = v4();
      const uri = monaco.Uri.file(uid);
      const model = monaco.editor.createModel(`use prelude`, 'nat', uri);
      setModel(model);
      return;
    }

    const uri = monaco.Uri.file(path);
    const model = monaco.editor.getModel(uri);

    if (model) {
      setModel(model);
      return;
    }

    (async () => {
      const content = root === CORE_DIR
        ? (await runtime.getFile(path)).content
        : root === DOC_REPO
          ? await git.getContent(DOC_REPO, path.replace(DOC_PATH, ""))
          : await git.getContent(LIB_REPO, path);
      const model = monaco.editor.createModel(content, 'nat', uri);

      setModel(model);
    })();
  }, [path, git]);

  return <>
    <Header>
      {githubAuth && root !== CORE_DIR && <Button onClick={handleSaveClick}>save</Button>}
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
          onChange={(value => {
            (async () => {
              if (!path) return;
              console.log(path);
              await runtime.setFile(path, value);
            })();
          })}
          onKeyDown={e => {
            if (e.metaKey && e.keyCode == 3) {
              if (!path) return;

              runtime.interpret(abs(path));
              e.stopPropagation();
            }
          }}
        />}
        right={width => <Canvas file={canvasFile} style={{ width }} />}
      />

      {openFilePane && <FilePane onSubmit={root === DOC_PATH ? handleDocSave : handleLibSave} files={libFiles} path={path} />}
    </div>
  </>;
};

export default Library;