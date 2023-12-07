import { useState, useEffect } from "react";

type UseCanvasObserverProps = {
  canvasWrapRef: React.MutableRefObject<HTMLDivElement>;
  canvasRef: React.MutableRefObject<HTMLDivElement>;
};

/**
 * Observers when the canvas changes size and sets it appropriately
 */
export function useCanvasObserver(props: UseCanvasObserverProps) {
  const { canvasWrapRef } = props;
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const setCanvasSizeFn = () => {
      if (canvasWrapRef && canvasWrapRef.current) {
        document.documentElement.style.setProperty(
          "--canvas-width",
          `${canvasWrapRef.current.offsetWidth}px`
        );

        setCanvasSize({
          width: canvasWrapRef.current.offsetWidth,
          height: canvasWrapRef.current.offsetHeight,
        });
      }
    };

    // record listener
    window.addEventListener("resize", () => {
      setCanvasSizeFn();
    });

    // run for the first time
    setCanvasSizeFn();
  }, [canvasWrapRef.current]);

  return {
    canvasWidth: canvasSize.width,
    canvasHeight: canvasSize.height,
  };
}
