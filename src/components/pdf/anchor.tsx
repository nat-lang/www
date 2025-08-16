import { FunctionComponent } from "react";
import StandalonePDF, { StandaloneProps } from "./standalone";
import useAnchor from "../../hooks/useAnchor";

type AnchorProps = StandaloneProps & {
  path: string;
  order: number;
};

const AnchorPDF: FunctionComponent<AnchorProps> = (
  ({ path, order, ...props }) => {
    const ref = useAnchor({ path, order })

    return <StandalonePDF ref={ref} path={path} {...props} />;
  }
);

export default AnchorPDF;