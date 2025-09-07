import { useEffect, useRef, useState } from "react";
import useCanvasCtx from "../context/canvas";

type UseAnchorProps = {
  path: string;
  order: number;
}
const useAnchor = ({ path, order }: UseAnchorProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [anchorInitialized, setAnchorInitialized] = useState(false);
  const { setAnchorRef, delAnchorRef, observer } = useCanvasCtx();

  useEffect(() => {
    setAnchorRef(path, { ...ref, path, order, inView: false });
    setAnchorInitialized(true);

    return () => {
      setAnchorInitialized(false);
      delAnchorRef(path);
    }
  }, [path]);


  useEffect(() => {
    if (!anchorInitialized) return;
    if (!ref.current) return;
    if (!observer) return;

    observer.observe(ref.current)

    return () => {
      if (observer && ref.current) {
        observer.unobserve(ref.current);
      }
    }
  }, [anchorInitialized, path, observer, ref.current]);

  return ref;
};

export default useAnchor;