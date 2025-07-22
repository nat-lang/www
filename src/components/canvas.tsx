import { FunctionComponent } from "react";
import Codeblock from "./codeblock";
import { Natput, TypesetNatput } from "../types";
import StandalonePDF from "./pdf/standalone";

type CanvasOps = {
  width: string;
  path: string;
  output: (Natput | TypesetNatput)[];
  initialScale?: number;
}

const Canvas: FunctionComponent<CanvasOps> = ({ output, width, path, initialScale }) => {
  return <div className="Canvas" style={{ width }}>
    {output.sort((a, b) => a.order > b.order ? 1 : -1).map(
      out => out.type == "tex"
        ? <StandalonePDF className="Canvas-item centered" key={out.id} file={(out as TypesetNatput).pdf} initialScale={initialScale} />
        : out.type == "codeblock"
          ? <Codeblock
            className="Canvas-item"
            key={out.id}
            block={out}
            parent={path} />
          : <></>
    )}
  </div>;
};

export default Canvas;