import { abs } from '@nat-lang/nat';
import runtime from '../service/nat/client';
import * as nls from '../service/nls/client';
import { useState } from 'react';


export const useEvaluation = () => {
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [pdf, setPdf] = useState<string | null>(null);
  const [_, setErrors] = useState<string | null>(null);

  const evaluate = async (path: string) => {
    setEvaluating(true);

    const intptResp = await runtime.typeset(abs(path));
    console.log(intptResp);
    if (intptResp.success) {
      const renderResp = await nls.render(intptResp.tex);
      setEvaluating(false);
      console.log(renderResp);
      if (renderResp.success && renderResp.pdf) {
        setPdf(renderResp.pdf);
        console.log(renderResp);
      }

      else if (renderResp.errors) {
        console.log(renderResp.errors);
        setErrors(renderResp.errors);
      }
    } else {
      console.log(intptResp.errors);
    }
  };

  return { evaluate, evaluating, pdf };
};