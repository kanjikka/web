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

  onClear: () => void;
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
    onClear,
  } = props;

  return (
    <div>
      {/*

        // Turns out undo/redo is more complicated with a lot of different canvases
      <button onClick={() => canvasRef?.current?.undo()}>undo</button>
      <button onClick={() => canvasRef?.current?.redo()}>redo</button>
        */}
      <button onClick={onClear}>clear</button>
      {/*

      <button onClick={() => toggleAssist()}>Toggle assist</button>
      <button onClick={() => sync()}>Send to other devices</button>
      <button onClick={() => toggleLocked()}>
        {isLocked ? "Enable" : "Disable"} Sync
      </button>
    */}
      <button disabled={!canZoomOut} onClick={zoomOut}>
        Zoom out (-)
      </button>
      <button disabled={!canZoomIn} onClick={zoomIn}>
        Zoom in (+)
      </button>
    </div>
  );
}
