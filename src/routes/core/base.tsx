import { FunctionComponent, useEffect } from 'react';
import Header from '../../components/header';
import { editor } from 'monaco-editor';
import Grid from '../../components/grid';
import Navigation from '../../components/navigation';
import Monaco from '../../components/monaco';
import { vw } from '../../utilities';
import useDimsCtx from '../../context/dims';

type BaseProps = {
  model: editor.ITextModel | null;
}

const Base: FunctionComponent<BaseProps> = ({ model }) => {
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

export default Base;