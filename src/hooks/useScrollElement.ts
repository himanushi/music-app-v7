import { useEffect, useRef, useState } from "react";

export const useScrollElement = () => {
  const contentRef = useRef<HTMLIonContentElement>(null);
  const [scrollElement, setScrollElement] = useState<HTMLElement>();

  useEffect(() => {
    (async () => {
      if (contentRef.current) {
        setScrollElement(await contentRef.current.getScrollElement());
      }
    })();
  }, [contentRef]);

  return { contentRef, scrollElement };
};
