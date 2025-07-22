import { GEN_START, InterpretResp, abs } from '@nat-lang/nat';
import runtime from '../service/nat/client';
import * as nls from '../service/nls/client';
import { useState } from 'react';

import { Natput, TypesetNatput } from '../types';
import { v4 } from 'uuid';

export const useRuntime = () => {
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [rendering, setRendering] = useState<boolean>(false);
  const [output, setOutput] = useState<(TypesetNatput | Natput)[]>([]);
  const [stdout, setStdout] = useState<string[]>([]);
  const [stderr, setStderr] = useState<string[]>([]);
  const [_, setErrors] = useState<string | null>(null);
  let order = 0;

  const process = async (intptResp: InterpretResp) => {
    if (!intptResp.success || !intptResp.out) return;

    order = order + 1;
    const iIntptResp = { id: v4(), order, ...intptResp };

    if (intptResp.type == "tex") {
      setRendering(true);
      try {
        const resp = await nls.render(intptResp.out)
        if (resp.success && resp.pdf)
          setOutput(out => [{ pdf: resp.pdf!, ...iIntptResp }, ...out]);
        else if (resp.errors)
          setErrors(resp.errors);
      } finally {
        setRendering(false);
      }
    } else {
      setOutput(out => [iIntptResp, ...out]);
    }
  }

  const evaluate = async (path: string) => {
    setOutput([]);
    setStdout([]);
    setStderr([]);

    setEvaluating(true);

    const disposables = [
      runtime.onStdout(
        out => setStdout(prev => [...prev, out])
      ),
      runtime.onStderr(
        out => setStderr(prev => [...prev, out])
      ),
    ];
    try {
      const resp = await runtime.interpret(abs(path));
      if (resp.out === GEN_START) {
        const genResp = runtime.generate(abs(path));
        for await (const resp of genResp)
          process(resp);
      } else {
        process(resp);
      }
    } finally {
      await runtime.free();
      disposables.forEach(x => x());
      setEvaluating(false);
    }
  }

  return { evaluate, evaluating, rendering, output, stdout, stderr };
};
