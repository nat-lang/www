import { useCallback, useEffect } from "react";

type useCmdKeysProps = {
  onS: () => void,
  onEnter: () => void
}

const useCmdKeys = ({ onS, onEnter }: useCmdKeysProps, deps: React.DependencyList) => {
  const handler = useCallback((e: KeyboardEvent) => {
    if (e.metaKey) {
      switch (e.key) {
        case "s": {
          onS();
          e.preventDefault();
          break;
        }
        case "Enter": {
          onEnter();
          break;
        }
      }
    }
  }, deps);

  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handler]);
};

export default useCmdKeys;
