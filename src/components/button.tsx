import { FunctionComponent, HTMLProps, ReactNode } from "react";
import "./button.css";

type ButtonOps = {
  children?: ReactNode
} & HTMLProps<HTMLDivElement>;

const Button: FunctionComponent<ButtonOps> = ({ children, ...props }) => {
  return <div {...props} className="Button">{children}</div>
};

export default Button;