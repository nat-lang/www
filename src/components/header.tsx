import { Link } from "react-router-dom";
import "./header.css";
import { FunctionComponent, ReactNode } from "react";

type HeaderOps = {
  children?: ReactNode
}

const Header: FunctionComponent<HeaderOps> = ({ children }) => {
  const token = localStorage.getItem("githubtoken")
  return <div className="Header">
    <Link className="root-link" to="/">natlang online</Link>
    <div className="HeaderLinks">
      {children}
      {token ? <Link to="/logout">logout</Link> : <Link to="/login">login</Link>}
    </div>
  </div>
};

export default Header;