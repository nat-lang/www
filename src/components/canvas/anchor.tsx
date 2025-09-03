import { FunctionComponent } from "react";
import useAnchor from "../../hooks/useAnchor";
import Markdown, { MarkdownProps } from "./markdown";
import { Link } from "react-router-dom";

type AnchorProps = MarkdownProps & {
  path: string;
  order: number;
};

const Anchor: FunctionComponent<AnchorProps> = (
  ({ path, order, className, ...props }) => {
    const ref = useAnchor({ path, order })

    return <Link className={className} to={path}><Markdown ref={ref} path={path} {...props} /></Link>;
  }
);

export default Anchor;