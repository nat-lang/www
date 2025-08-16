import { Link } from "react-router-dom";
import "./header.css";
import { FunctionComponent, ReactNode } from "react";
import useAuthCtx from "../context/auth";
import { useShallow } from 'zustand/react/shallow'
import Button from "./button";

type HeaderOps = {
  children?: ReactNode
}

const Header: FunctionComponent<HeaderOps> = ({ children }) => {
  const [token, setToken] = useAuthCtx(
    useShallow(state => [state.token, state.setToken])
  );

  const handleLogoutClick = () => setToken("");

  return <div className="Header">
    <Link className="HeaderRootLink" to="/">natlang online</Link>
    <div className="HeaderLinks">
      {children}
      {token ? <Button onClick={handleLogoutClick}>logout</Button> : <Link to="/login">login</Link>}
    </div>
  </div>
};

export default Header;