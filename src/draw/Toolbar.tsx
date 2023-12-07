import { PracticeCanvasHandle } from "./PracticeCanvas";
import type { useZoom } from "./useZoom";

type ToolbarProps = {
  canvasRef: React.MutableRefObject<PracticeCanvasHandle>;
  toggleAssist: () => void;
  sync: () => void;
  toggleLocked: () => void;
  isLocked: boolean;

  zoomIn: ReturnType<typeof useZoom>["zoomIn"];
  zoomOut: ReturnType<typeof useZoom>["zoomOut"];
  canZoomIn: ReturnType<typeof useZoom>["canZoomIn"];
  canZoomOut: ReturnType<typeof useZoom>["canZoomOut"];
};

export function Toolbar(props: ToolbarProps) {
  const {
    canvasRef,
    sync,
    toggleAssist,
    isLocked,
    toggleLocked,
    zoomIn,
    zoomOut,
    canZoomIn,
    canZoomOut,
  } = props;

  return (
    <div>
      <button onClick={() => canvasRef?.current?.undo()}>undo</button>
      <button onClick={() => canvasRef?.current?.redo()}>redo</button>
      <button onClick={() => canvasRef?.current?.clear()}>clear</button>
      <button onClick={() => toggleAssist()}>Toggle assist</button>
      <button onClick={() => sync()}>Send to other devices</button>
      <button onClick={() => toggleLocked()}>
        {isLocked ? "Enable" : "Disable"} Sync
      </button>
      <button disabled={!canZoomOut} onClick={zoomOut}>
        Zoom out (-)
      </button>
      <button disabled={!canZoomIn} onClick={zoomIn}>
        Zoom in (+)
      </button>
    </div>
  );
}
