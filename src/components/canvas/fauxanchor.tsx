import { FunctionComponent } from "react";
import useAnchor from "../../hooks/useAnchor";

type FauxAnchorProps = {
  path: string;
  order: number;
};

const FauxAnchor: FunctionComponent<FauxAnchorProps> = (
  ({ path, order }) => {
    const ref = useAnchor({ path, order })

    return <div className="FauxAnchor" style={{ width: "1px", height: "1px" }} ref={ref} data-path={path} />;
  }
);

export default FauxAnchor;