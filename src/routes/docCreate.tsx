import { useState, FunctionComponent } from 'react';
import Navigation from '../components/navigation';
import { useNavigate } from 'react-router-dom';
import runtime from '../service/nat/client';
import Header from '../components/header';
import Button from '../components/button';
import Git, { DOC_REPO } from '../service/git';
import FilePane, { FilePaneFieldValues } from '../components/filepane';
import Editor from '../components/editor';
import useFileCtx from '../context/file';
import Grid from '../components/grid';
import { useRuntime } from '../hooks/useRuntime';
import { useMonaco } from '../hooks/useMonaco';
import LoadingGear from '../icons/loadingGear';
import useCreateCtx from '../context/create';
import Canvas from '../components/canvas';

type DocCreateProps = {
  git: Git | null;
}

const DocCreate: FunctionComponent<DocCreateProps> = ({ git }) => {
  const navigate = useNavigate();
  const { docTree, libLoaded } = useFileCtx();
  const [openFilePane, setOpenFilePane] = useState<boolean>(false);
  const { doc, docPath: path } = useCreateCtx();
  const model = useMonaco(path, doc);
  const { evaluate, evaluating, output } = useRuntime();

  const formPath = (form: FilePaneFieldValues) => form.folder ? `${form.folder}/${form.filename}` : form.filename;

  const handleSave = async (form: FilePaneFieldValues) => {
    if (!git) return;
    if (!model) return;
    const path = formPath(form);

    await git.commitFileChange(path, model.getValue(), DOC_REPO, import.meta.env.VITE_GITHUB_BRANCH);
    setOpenFilePane(false);
    navigate(`/guide/${path}`);
  };

  return <>
    <Header>
      <Button onClick={() => setOpenFilePane(true)}>save</Button>
      <Button disabled={!libLoaded} onClick={() => path && evaluate(path)}>evaluate</Button>
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
        right={width => evaluating
          ? <div className="CanvasPreview" style={{ width }}><LoadingGear /></div>
          : <Canvas output={output} path={path} width={width} />
        }
      />

      {openFilePane && <FilePane onSubmit={handleSave} files={docTree} />}
    </div>
  </>;
};

export default DocCreate;