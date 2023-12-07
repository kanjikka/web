import dynamic from "next/dynamic";
import { PracticeCanvasHandle } from "./PracticeCanvas";

const KeyboardEventHandler = dynamic(
  () => import("react-keyboard-event-handler"),
  { ssr: false }
);
export function KeyboardHandler(props: {
  canvasRef: React.MutableRefObject<PracticeCanvasHandle>;
}) {
  const { canvasRef } = props;

  return (
    <KeyboardEventHandler
      handleKeys={["ctrl+z", "ctrl+r", "ctrl+l"]}
      onKeyEvent={(key: string, e: KeyboardEvent) => {
        e.preventDefault();
        switch (key) {
          case "ctrl+z": {
            canvasRef.current.undo();
            break;
          }
          case "ctrl+r": {
            canvasRef.current.redo();
            break;
          }
          case "ctrl+l": {
            canvasRef.current.clear();
            break;
          }

          default: {
            throw new Error("key not implemented" + key);
          }
        }
      }}
    />
  );
}
