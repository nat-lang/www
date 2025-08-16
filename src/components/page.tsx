import { FunctionComponent, useEffect, useRef } from 'react';
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

type PageProps = {
  evaluating: boolean;
  fsPath: string;
  urlPath?: string;
  model: editor.ITextModel | null;
  className?: string;
  orientation: "OE" | "EO"
}

const Page: FunctionComponent<PageProps> = ({ evaluating, fsPath, urlPath, model, className = "", orientation }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const canvasCtx = useCanvasCtx();
  const { setDims } = useDimsCtx();
  const Nav = ({ left }: Dims) => <Navigation style={{ flexBasis: vw(left) }} />;
  const Editor = (pane: keyof Dims) => (dims: Dims) => <Monaco model={model} style={{ width: vw(dims[pane]) }} />;
  const Output = (pane: keyof Dims) => (dims: Dims) => <div className="Page" style={{ width: vw(dims[pane]) }} >
    {evaluating
      ? <div className="CanvasPreview" style={{ width: vw(dims[pane]) }}><LoadingGear /></div>
      : <div className="PageScrollguard" ref={ref}>
        <Canvas fsPath={fsPath} urlPath={urlPath} />
      </div>
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

  useEffect(() => {
    canvasCtx.setPageRef(ref);
    return canvasCtx.delPageRef;
  }, []);

  return <div className={`Editor ${className}`}>
    {(() => {
      switch (orientation) {
        case "OE":
          return <Grid
            left={Nav}
            center={Output("center")}
            right={Editor("right")}
          />
        case "EO":
          return <Grid
            left={Nav}
            center={Editor("center")}
            right={Output("right")}
          />
      }
    })()}

  </div>;
};

export default Page;