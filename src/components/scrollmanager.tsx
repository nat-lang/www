import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import useCanvasCtx from "../context/canvas";
import { sortObjs } from "../utilities";
import { useLocation, useNavigate } from "react-router-dom";

type ScrollManagerProps = {
  children: ReactNode;
}

const ScrollManager: FunctionComponent<ScrollManagerProps> = ({ children }) => {
  const { pageRef, anchorRefs, setObserver, setAnchorRefInView } = useCanvasCtx();
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);
  const [noScroll, setNoScroll] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  // set a scroll target if it's in the url.
  useEffect(() => {
    if (noScroll) {
      setNoScroll(false);
      return;
    }
    if (scrollTarget) return;

    setScrollTarget(location.pathname + location.hash);
  }, [location]);

  // scroll to target.
  useEffect(() => {
    const scrollTargetRef = scrollTarget ? anchorRefs[scrollTarget] : null;
    if (!scrollTargetRef?.current) return;
    if (scrollTargetRef.inView) return;
    scrollTargetRef.current.scrollIntoView({ behavior: "smooth" });
  }, [scrollTarget, anchorRefs]);

  // track two things:
  // a) whether anchor elements are in view, and
  // b) whether we've arrived at a scroll target.
  useEffect(() => {
    if (!pageRef?.current) return;

    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {

          const target = entry.target as HTMLDivElement

          if (target.dataset.path)
            setAnchorRefInView(target.dataset.path, entry.isIntersecting);
          if (target.dataset.path === scrollTarget && entry.isIntersecting)
            setScrollTarget(null);
        }
      },
      { root: pageRef.current }
    );

    setObserver(io);

    return () => {
      io.disconnect();
      setObserver(null);
    };
  }, [pageRef, scrollTarget]);

  const firstAnchorInView = sortObjs(Object.values(anchorRefs)).find(ref => ref.inView);

  // update the url if an anchor scrolls into view.
  useEffect(() => {
    // we're scrolling programatically; nothing to do.
    if (scrollTarget) return;
    // no anchor in view.
    if (!firstAnchorInView) return;
    // we're already at the ref's url.
    if (firstAnchorInView.path === location.pathname + location.hash) return;
    // update the url without setting a new scroll target.
    setNoScroll(true);
    navigate(firstAnchorInView.path);
  }, [firstAnchorInView, scrollTarget]);

  return children;
};

export default ScrollManager;