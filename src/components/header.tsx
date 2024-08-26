import { Link } from "react-router-dom";
import "./header.css";

export default function Header() {
  return <div className="Header">
    <div>natlang online</div>
    <Link to="/login">login</Link>
  </div>
}