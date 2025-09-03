import { forwardRef } from "react";
import MD from "react-markdown";
import rehypeRaw from "rehype-raw";

export type MarkdownProps = {
  className?: string;
  path?: string;
  children: string | null | undefined;
}

const Markdown = forwardRef<HTMLDivElement, MarkdownProps>(({ path, children, className = "" }, ref) => {
  return <div ref={ref} className={`Markdown ${className}`} data-path={path}><MD rehypePlugins={[rehypeRaw]}>{children}</MD></div>
});

export default Markdown;