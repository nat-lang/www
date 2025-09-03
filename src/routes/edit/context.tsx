import { useOutletContext } from "react-router-dom";
import BaseEdit from "./base";
import { OutletContext } from "../../types";

const EditContext = () => {
  const outlet = useOutletContext<OutletContext>();
  return <BaseEdit model={outlet.ctxModel} />
}

export default EditContext;