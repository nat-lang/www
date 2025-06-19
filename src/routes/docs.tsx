import { useState, useEffect, FunctionComponent } from 'react';
import Navigation from '../components/navigation';
import { useNavigate, useParams } from 'react-router-dom';
import runtime from '../service/nat/client';
import Header from '../components/header';
import Button from '../components/button';
import Canvas from '../components/canvas';
import Git, { DOC_REPO } from '../service/git';
import FilePane, { FilePaneFieldValues } from '../components/filepane';
import useAuthCtx from '../context/auth';
import { DOC_PATH } from '../config';
import Editor from '../components/editor';
import useFileCtx from '../context/file';
import Grid from '../components/grid';
import { useEvaluation } from '../service/hooks/evaluate';
import { useModel } from '../service/hooks/useModel';
import LoadingGear from '../icons/loadingGear';

type DocsProps = {
  git: Git | null;
}

const Docs: FunctionComponent<DocsProps> = ({ git }) => {
  const params = useParams();
  const navigate = useNavigate();
  const { docTree, docsLoaded, libLoaded } = useFileCtx();
  const githubAuth = useAuthCtx(state => state.token);
  const [openFilePane, setOpenFilePane] = useState<boolean>(false);
  const path = params["*"];
  const fullPath = `${DOC_PATH}/${path}`;
  const content = useFileCtx(state => state.docs[fullPath]);
  const model = useModel(path, content);
  const { evaluate, evaluating, pdf } = useEvaluation();
  const handleSaveClick = () => setOpenFilePane(true);
  const formPath = (form: FilePaneFieldValues) => form.folder ? `${form.folder} / ${form.filename}` : form.filename;
  const handleSave = async (form: FilePaneFieldValues) => {
    if (!git) return;
    if (!model) return;
    const path = formPath(form).replace(`${DOC_PATH}/`, "");
    await git.commitFileChange(path, model.getValue(), DOC_REPO, import.meta.env.VITE_GITHUB_BRANCH);
    setOpenFilePane(false);
    navigate(`/${DOC_PATH}/${path}`);
  };

  useEffect(() => {
    if (docsLoaded && libLoaded && fullPath)
      evaluate(fullPath);
  }, [docsLoaded, libLoaded])

  return <>
    <Header>
      {githubAuth && <Button onClick={handleSaveClick}>save</Button>}
      <Button onClick={() => path && evaluate(fullPath)}>evaluate</Button>
    </Header>
    <div className="Editor">
      <Grid
        initialDims={{
          left: 15,
          center: 55,
          right: 30
        }}
        left={width => <Navigation style={{ flexBasis: width }} />}
        center={width => evaluating || !pdf
          ? <div className="CanvasPreview" style={{ width }}><LoadingGear /></div>
          : <Canvas file={pdf} style={{ width }} initialScale={1.7} />
        }
        right={width => <Editor model={model} style={{ width }}
          onChange={value => runtime.setFile(`${DOC_PATH}/${path}`, value)}
        />}
      />

      {openFilePane && <FilePane onSubmit={handleSave} files={docTree} path={path} />}
    </div>
  </>;
};

export default Docs;