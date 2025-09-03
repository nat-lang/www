import { GEN_START, NatResp } from '@nat-lang/nat';
import runtime from '../service/nat/client';
import * as nls from '../service/nls/client';
import { useState } from 'react';

import { v4 } from 'uuid';
import useRuntimeCtx from '../context/runtime';
import useFileCtx from '../context/file';
import useCanvasCtx from '../context/canvas';
import { StampedNatResp, StampedTexResp } from '../types';

export const useRuntime = () => {
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [rendering, setRendering] = useState<boolean>(false);
  const { initialized } = useRuntimeCtx();
  const { addObj, delObjs } = useCanvasCtx();

  const [stdout, setStdout] = useState<string[]>([]);
  const [stderr, setStderr] = useState<string[]>([]);
  const [_, setErrors] = useState<string | null>(null);

  const fileCtx = useFileCtx();
  const canEvaluate = initialized && fileCtx.filesLoaded() && !evaluating && !rendering;

  let order = 0;

  const render = (tex: string) => new Promise<string>(
    (resolve, reject) => nls.render(tex).then(resp => {
      if (resp.success && resp.pdf)
        resolve(resp.pdf)
      else if (resp.errors)
        setErrors(resp.errors);
      else
        reject(["Empty resp."]);
    })
  );

  const process = async (path: string, resp: NatResp) => {
    if (!resp.success || !resp.out) return;

    order = order + 1;
    const stampedResp: StampedNatResp = { id: v4(), order, ...resp };

    switch (stampedResp.type) {
      case "tex": {
        const pdf = await render((resp as StampedTexResp).out);
        addObj(path, { pdf, ...stampedResp });
        break;
      }
      case "anchor":
      case "markdown":
      case "codeblock":
      case "string":
        addObj(path, stampedResp);
        break;
      default:
        throw new Error(`Unexpected resp type: '${stampedResp.type}'`);
    }
  }

  const evaluate = async (path: string) => {
    delObjs(path);
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
      const resp = await runtime.interpret(path);

      if (resp.out === GEN_START) {
        const genResp = runtime.generate(path);

        setRendering(true);
        const futures = [];
        for await (const resp of genResp)
          futures.push(process(path, resp));
        Promise.all(futures).finally(() => setRendering(false));
      } else {
        setRendering(true);
        process(path, resp).finally(() => setRendering(false));
      }
    } finally {
      disposables.forEach(x => x());
      setEvaluating(false);
    }
  }

  return {
    evaluate,
    canEvaluate,
    evaluating,
    rendering,
    stdout,
    stderr
  };
};
