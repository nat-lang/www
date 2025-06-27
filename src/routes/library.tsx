import { useState, FunctionComponent, useEffect } from 'react';
import Navigation from '../components/navigation';
import { useNavigate, useParams } from 'react-router-dom';
import runtime from '../service/nat/client';
import Header from '../components/header';
import Button from '../components/button';
import Canvas from '../components/canvas';
import Git, { LIB_REPO } from '../service/git';
import FilePane, { FilePaneFieldValues } from '../components/filepane';
import Editor from '../components/editor';
import useFileCtx from '../context/file';
import Grid from '../components/grid';
import { useEvaluation } from '../hooks/useEvaluation';
import { useModel } from '../hooks/useModel';
import LoadingGear from '../icons/loadingGear';

type LibraryProps = {
  git: Git | null;
}

const Library: FunctionComponent<LibraryProps> = ({ git }) => {
  const navigate = useNavigate();
  const { libTree, libLoaded } = useFileCtx();
  const [openFilePane, setOpenFilePane] = useState<boolean>(false);
  const params = useParams();
  const path = params["*"];
  const content = useFileCtx(state => path ? state.lib[path] : undefined);
  const model = useModel(path, content);
  const { evaluate, evaluating, pdf } = useEvaluation();

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
    if (libLoaded && path)
      evaluate(path);
  }, [libLoaded])

  return <>
    <Header>
      <Button onClick={() => setOpenFilePane(true)}>save</Button>
      <Button onClick={() => path && evaluate(path)}>evaluate</Button>
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
        right={width => evaluating || !pdf
          ? <div className="CanvasPreview" style={{ width }}><LoadingGear /></div>
          : <Canvas file={pdf} style={{ width }} />
        }
      />

      {openFilePane && <FilePane onSubmit={handleSave} files={libTree} path={path} />}
    </div>
  </>;
};

export default Library;