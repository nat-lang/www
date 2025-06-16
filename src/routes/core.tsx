import { useState, useEffect, FunctionComponent } from 'react';
import * as monaco from 'monaco-editor';
import './library.css';
import Navigation from '../components/navigation';
import { useLocation } from 'react-router-dom';
import runtime from '../service/nat/client';
import Header from '../components/header';
import Button from '../components/button';
import Canvas from '../components/canvas';
import Git from '../service/git';
import * as nls from '../service/nls/client';
import { abs } from '@nat-lang/nat';
import Editor from '../components/editor';
import Grid from '../components/grid';

type CoreProps = {
  git: Git | null;
}

const Core: FunctionComponent<CoreProps> = ({ git }) => {
  const [model, setModel] = useState<monaco.editor.ITextModel | null>(null);
  const [canvasFile, setCanvasFile] = useState<string>();
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

  useEffect(() => {
    if (!git) return;

    const uri = monaco.Uri.file(pathname);
    const model = monaco.editor.getModel(uri);

    if (model) {
      setModel(model);
      return;
    }

    (async () => {
      const content = (await runtime.getFile(pathname)).content;
      const model = monaco.editor.createModel(content, 'nat', uri);

      setModel(model);
    })();
  }, [pathname, git]);

  return <>
    <Header>
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
              await runtime.setFile(pathname, value);
            })();
          })}
        />}
        right={width => <Canvas file={canvasFile} style={{ width }} />}
      />
    </div>
  </>;
};

export default Core;