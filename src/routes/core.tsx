import { FunctionComponent, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/header';
import useModelCtx, { createModel } from '../context/monaco';
import runtime from '../service/nat/client';
import { editor } from 'monaco-editor';
import Grid from '../components/grid';
import Navigation from '../components/navigation';
import Monaco from '../components/monaco';
import { vw } from '../utilities';
import useDimsCtx from '../context/dims';

type CoreBaseProps = {
  model: editor.ITextModel | null;
}

export const CoreBase: FunctionComponent<CoreBaseProps> = ({ model }) => {
  const { left, right, center, setDims } = useDimsCtx();
  useEffect(() => {
    setDims(() => ({ left, center: 100 - left, right: 0 }));
    return () => setDims(() => ({ left, right, center }));
  }, []);

  return <>
    <Header />
    <div className="Editor">
      <Grid
        left={
          ({ left }) => <Navigation style={{ flexBasis: vw(left) }} />
        }
        center={
          ({ center }) => <Monaco model={model} style={{ width: vw(center) }} />
        }
        right={() => <></>}
      />
    </div>

  </>;
};

const Core: FunctionComponent = () => {
  const { pathname: path } = useLocation();
  const { models, setModel, delModel } = useModelCtx();
  const model = path ? models[path] : null;

  useEffect(() => {
    if (!model)
      runtime.getFile(path).then(
        file => setModel(path, createModel(path, file.content))
      );
    return () => { if (model) delModel(path); };
  }, [path]);

  return <CoreBase model={model} />;
};

export default Core;