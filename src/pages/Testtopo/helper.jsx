import { useCallback, useState } from "react";
import './../Testtopo/testtopo.css';

export const useCenteredTree = () => {
  const [translate, setTranslate] = useState({ x: 150, y: 200 });
  const containerRef = useCallback((containerElem) => {
    if (containerElem !== null) {
      const { width, height } = containerElem.getBoundingClientRect();
      setTranslate({ x: width / 2, y: height / 2 });
    }
  }, []);
  return [translate, containerRef];
};
