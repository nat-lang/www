import { Link as _Link, LinkProps, useMatch, useResolvedPath } from "react-router-dom";

const Link = ({ children, to, ...props }: LinkProps) => {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  console.log(resolved, match)
  return <_Link
    to={to}
    {...props}
  >
    {children}
  </_Link>;
};

export default Link;
