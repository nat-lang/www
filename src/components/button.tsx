import { FunctionComponent, HTMLProps, MouseEvent, ReactNode } from "react";
import "./button.css";

type ButtonOps = {
  children?: ReactNode;
  disabled?: boolean;
  inflight?: boolean;
} & HTMLProps<HTMLDivElement>;

const Button: FunctionComponent<ButtonOps> = ({ children, className = "", disabled = false, inflight = false, onClick, ...props }) => {
  const handleClick = (e: MouseEvent<HTMLDivElement>) =>
    !disabled && onClick && onClick(e);

  return <div
    className={`Button ${disabled ? "Button--disabled" : ""} ${inflight ? "Button--inflight" : ""} ${className}`}
    onClick={handleClick}
    {...props}>
    {children}
  </div>
};

export default Button;