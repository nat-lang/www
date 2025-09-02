import { useLocation } from "react-router-dom";
import useFileCtx from "../../context/file";
import { useModel } from "../../context/monaco";
import BaseEdit from "./base";

const Edit = () => {
  const { repoMap } = useFileCtx();
  const path = useLocation().pathname;
  const model = useModel(path, repoMap[path]);
  return <BaseEdit model={model} />
}

export default Edit;