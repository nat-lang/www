import { SVG } from "./svg";
import "./check.css";

const Check: SVG = ({ className = "", ...props }) => {
  return <svg className={`Check ${className}`} viewBox="0 0 100 100" width="25" height="25" {...props}>
    <circle id="circle" cx="50" cy="50" r="46" fill="transparent" />
    <polyline id="tick" points="25,55 45,70 75,33" fill="transparent" />
  </svg>
};

export default Check
