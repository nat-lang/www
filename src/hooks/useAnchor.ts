import { useEffect, useRef } from "react";
import useCanvasCtx from "../context/canvas";

type UseAnchorProps = {
  path: string;
  order: number;
}
const useAnchor = ({ path, order }: UseAnchorProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { setAnchorRef, delAnchorRef, observer } = useCanvasCtx();

  useEffect(() => {
    setAnchorRef(path, { ...ref, path, order, inView: false });

    return () => {
      delAnchorRef(path);
    }
  }, [path]);


  useEffect(() => {
    if (!ref.current) return;
    if (!observer) return;

    // setAnchorRef(path, { ...ref, path, order, inView: false });
    observer.observe(ref.current)

    return () => {
      if (observer && ref.current) {
        observer.unobserve(ref.current);
        // delAnchorRef(path);
      }
    }
  }, [path, observer, ref.current]);

  return ref;
};

export default useAnchor;