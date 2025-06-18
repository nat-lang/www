import runtime from './nat/client';
import * as nls from './nls/client';

export const evaluate = async (path: string) => {
  const intptResp = await runtime.typeset(path);

  if (intptResp.success) {
    const renderResp = await nls.render(intptResp.tex);
    if (renderResp.success && renderResp.pdf)
      return renderResp.pdf;
    else if (renderResp.errors)
      console.log(renderResp.errors);
  } else {
    console.log(intptResp.errors);
  }
};