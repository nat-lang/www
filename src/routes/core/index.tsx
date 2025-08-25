import { FunctionComponent, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useModelCtx, { createModel } from "../../context/monaco";
import runtime from '../../service/nat/client';
import CoreBase from "./base";

const Core: FunctionComponent = () => {
  const { pathname: path } = useLocation();
  const { models, setModel, delModel } = useModelCtx();
  const model = path ? models[path] : null;

  useEffect(() => {
    if (!model)
      runtime.getFile(path).then(
        file => setModel(path, createModel(path, file.content))
      );
    return () => { if (model) delModel(path); };
  }, [path]);

  return <CoreBase model={model} />;
};

export default Core;