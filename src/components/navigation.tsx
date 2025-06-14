
import { ReactNode, forwardRef } from "react";
import "./navigation.css";

type NavigationOps = {
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

const Navigation = forwardRef<HTMLDivElement, NavigationOps>(({ children, style, className = "" }, ref) => {
  return <div ref={ref} className={`Navigation ${className}`} style={style}>
    {children}
  </div>;
});

export default Navigation;