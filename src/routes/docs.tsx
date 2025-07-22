import { useState, useEffect, FunctionComponent } from 'react';
import Navigation from '../components/navigation';
import { useNavigate, useParams } from 'react-router-dom';
import runtime from '../service/nat/client';
import Header from '../components/header';
import Button from '../components/button';
import Git, { DOC_REPO } from '../service/git';
import FilePane, { FilePaneFieldValues } from '../components/filepane';
import useAuthCtx from '../context/auth';
import { DOC_PATH } from '../config';
import Editor from '../components/editor';
import useFileCtx from '../context/file';
import Grid from '../components/grid';
import { useRuntime } from '../hooks/useRuntime';
import { useMonaco } from '../hooks/useMonaco';
import LoadingGear from '../icons/loadingGear';
import usePersistence from '../hooks/usePersistence';
import Canvas from '../components/canvas';
import useCmdKeys from '../hooks/useCmdKeys';
import { pathBits } from '../utilities';

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
  const model = useMonaco(path, content);
  const { evaluate, evaluating, rendering, output } = useRuntime();
  const { save, saving } = usePersistence(git, model, DOC_REPO);

  const handleNewClick = () => navigate(`/guide/new`);
  const handleSave = async (form: FilePaneFieldValues) => {
    setOpenFilePane(false);
    await save(form);
    navigate(`/${fullPath}`);
  };

  useCmdKeys({
    onS: () => {
      if (!path) return;
      const [folder, filename] = pathBits(path);
      save({ folder, filename });
    },
    onEnter: () => path && evaluate(fullPath)
  }, [path, fullPath, save]);

  useEffect(() => {
    if (docsLoaded && libLoaded && fullPath)
      evaluate(fullPath);
  }, [fullPath, docsLoaded, libLoaded])

  return <>
    <Header>
      {githubAuth && <Button disabled={saving} inflight={saving} className="SaveButton" onClick={() => setOpenFilePane(true)}>
        <LoadingGear className="SaveIcon" />
        <div className="Button-text">save</div>
      </Button>}
      <Button disabled={evaluating || rendering} inflight={evaluating || rendering} className="EvalButton" onClick={() => path && evaluate(fullPath)}>
        <LoadingGear className="SaveIcon" />
        <div className="Button-text">evaluate</div>
      </Button>
      <Button onClick={handleNewClick}>new</Button>
    </Header>
    <div className="Editor Docs">
      <Grid
        initialDims={{
          left: 15,
          center: 55,
          right: 30
        }}
        left={width => <Navigation style={{ flexBasis: width }} />}
        center={width => evaluating
          ? <div className="CanvasPreview" style={{ width }}><LoadingGear /></div>
          : <Canvas output={output} path={fullPath} width={width} initialScale={1.5} />
        }
        right={width => <Editor model={model} style={{ width }}
          onChange={value => runtime.setFile(fullPath, value)}
        />}
      />

      {openFilePane && <FilePane onSubmit={handleSave} files={docTree} path={path} />}
    </div>
  </>;
};

export default Docs;