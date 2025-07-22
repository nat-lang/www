import { useEffect } from "react";

type useKeysProps = {
  onS: () => void,
  onEnter: () => void
}

const useCmdKeys = ({ onS, onEnter }: useKeysProps) => {
  const handler = (e: KeyboardEvent) => {
    if (e.metaKey && e.shiftKey) {
      switch (e.key) {
        case "s": {
          console.log("?");
          onS();
          e.stopPropagation();
          break;
        }
        case "Enter": onEnter(); break;
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
};

export default useCmdKeys;
