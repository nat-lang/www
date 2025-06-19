import { abs } from '@nat-lang/nat';
import runtime from '../nat/client';
import * as nls from '../nls/client';
import { useState } from 'react';


export const useEvaluation = () => {
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [pdf, setPdf] = useState<string | null>(null);

  const evaluate = async (path: string) => {
    setEvaluating(true);

    const intptResp = await runtime.typeset(abs(path));

    if (intptResp.success) {
      const renderResp = await nls.render(intptResp.tex);
      setEvaluating(false);

      if (renderResp.success && renderResp.pdf)
        setPdf(renderResp.pdf);
      else if (renderResp.errors)
        console.log(renderResp.errors);
    } else {
      console.log(intptResp.errors);
    }
  };

  return { evaluate, evaluating, pdf };
};