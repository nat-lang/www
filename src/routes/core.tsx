import { useState, useEffect, FunctionComponent } from 'react';
import * as monaco from 'monaco-editor';
import Navigation from '../components/navigation';
import { useLocation } from 'react-router-dom';
import runtime from '../service/nat/client';
import Header from '../components/header';
import Button from '../components/button';
import Editor from '../components/editor';
import Grid from '../components/grid';
import { useRuntime } from '../hooks/useRuntime';
import LoadingGear from '../icons/loadingGear';
import { getOrCreateMonacoModel } from '../utilities';
import Canvas from '../components/canvas';

type CoreProps = {}

const Core: FunctionComponent<CoreProps> = () => {
  const [model, setModel] = useState<monaco.editor.ITextModel | null>(null);
  const { pathname: path } = useLocation();
  const { evaluate, evaluating, output } = useRuntime();

  useEffect(() => {
    (async () => {
      setModel(
        await getOrCreateMonacoModel(path, async () => (await runtime.getFile(path)).content)
      );
    })();
  }, [path]);

  return <>
    <Header>
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
          onChange={(value => {
            (async () => {
              await runtime.setFile(path, value);
            })();
          })}
        />}
        right={width => evaluating
          ? <div className="CanvasPreview" style={{ width }}><LoadingGear /></div>
          : <Canvas output={output} path={path} width={width} />
        }
      />
    </div>
  </>;
};

export default Core;