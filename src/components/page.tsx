import { FunctionComponent } from 'react';
import Grid, { MIN_COL_VW } from './grid';
import Navigation from './navigation';
import LoadingGear from '../icons/loadingGear';
import ArrowRight from '../icons/arrowRight';
import Pencil from '../icons/pencil';
import Monaco from './monaco';
import { vw } from '../utilities';
import useDimsCtx, { Dims } from '../context/dims';
import { editor } from 'monaco-editor';
import Canvas from './canvas';
import useCanvasCtx from '../context/canvas';
import { useShallow } from 'zustand/react/shallow';
import ScrollManager from './scrollmanager';

type PageProps = {
  evaluating: boolean;
  model: editor.ITextModel | null;
  className?: string;
  orientation: "OE" | "EO"
}

const Page: FunctionComponent<PageProps> = ({ evaluating, model, className = "", orientation }) => {
  const { setDims } = useDimsCtx(useShallow(({ setDims }) => ({ setDims })));

  const Editor = (pane: keyof Dims) => (dims: Dims) => <Monaco model={model} style={{ width: vw(dims[pane]) }} />;
  const Output = (pane: keyof Dims) => (dims: Dims) => <div className="Page" style={{ width: vw(dims[pane]) }} >
    {evaluating
      ? <div className="CanvasPreview" style={{ width: vw(dims[pane]) }}><LoadingGear /></div>
      : <Canvas />
    }

    {dims.right > MIN_COL_VW
      ? <ArrowRight
        className="SnapIcon SnapIcon-close"
        onClick={() => setDims(({ left }) => ({ left, center: 100 - (left + MIN_COL_VW), right: MIN_COL_VW }))}
      />
      : <Pencil
        className="SnapIcon SnapIcon-min"
        onClick={() => setDims(({ left }) => ({ left, center: (100 - left) / 2, right: (100 - left) / 2 }))}
      />}
  </div>;

  return <div className={`Editor ${className}`}>
    <ScrollManager>
      {(() => {
        switch (orientation) {
          case "OE":
            return <Grid
              left={({ left }) => <Navigation style={{ flexBasis: vw(left) }} />}
              center={Output("center")}
              right={Editor("right")}
            />
          case "EO":
            return <Grid
              left={({ left }) => <Navigation style={{ flexBasis: vw(left) }} />}
              center={Editor("center")}
              right={Output("right")}
            />
        }
      })()}
    </ScrollManager>
  </div>;
};

export default Page;