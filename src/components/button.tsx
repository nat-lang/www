import { FunctionComponent, HTMLProps, MouseEvent, ReactNode } from "react";
import "./button.css";

type ButtonOps = {
  children?: ReactNode;
  disabled?: boolean;
} & HTMLProps<HTMLDivElement>;

const Button: FunctionComponent<ButtonOps> = ({ children, className = "", disabled = false, onClick, ...props }) => {
  const handleClick = (e: MouseEvent<HTMLDivElement>) =>
    !disabled && onClick && onClick(e);

  return <div
    className={`Button ${disabled ? "Button--disabled" : ""} ${className}`}
    onClick={handleClick}
    {...props}>
    {children}
  </div>
};

export default Button;