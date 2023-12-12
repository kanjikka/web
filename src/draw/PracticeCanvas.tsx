import { fabric } from "fabric";
import {
  Ref,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  forwardRef,
  memo,
  useRef,
} from "react";
import { PSBrush } from "@arch-inc/fabricjs-psbrush";
import { useHistory } from "./history";
import { IEvent } from "fabric/fabric-impl";

// eh, should be unique enough
//const CANVAS_ID = "drawing-canvas";

type PracticeCanvasProps = {
  width: number;
  height: number;
  className?: string;
  canvasID: string;
  zoomLevel?: number;
};

export default function PCanvas({
  forwardRef,
  ...props
}: PracticeCanvasProps & { forwardRef: Ref<PracticeCanvasHandle> }) {
  return <PracticeCanvas ref={forwardRef} {...props} />;
}

export type PracticeCanvasHandle = {
  undo: () => void;
  redo: () => void;
  clear: () => void;
};

// https://stackoverflow.com/a/62258685
const PracticeCanvasComponent: React.ForwardRefRenderFunction<
  PracticeCanvasHandle,
  PracticeCanvasProps
> = (props: PracticeCanvasProps, ref: Ref<PracticeCanvasHandle>) => {
  const canvas = useRef<fabric.Canvas>();
  const [isDrawing, setIsDrawing] = useState(false);
  const [locked, setLocked] = useState(false);
  const { zoomLevel } = props;

  // TODO
  // load from local storage or something
  const history = useHistory({
    clearState: {
      version: "4.5.0",
      objects: [],
    },
  });

  // Imperative Handlers
  //
  // allow the parent to interact in an imperative form by calling
  // the methods directly
  //
  // the checks are to prevent any action to happen when user is drawing
  // for example, pressing ctrl+z while drawing
  // here we prefer to just ignore the event
  useImperativeHandle(ref, () => ({
    undo: () => {
      if (!locked && !isDrawing) {
        history.undo();
      }
    },
    redo: () => {
      if (!locked && !isDrawing) {
        history.redo();
      }
    },
    clear: () => {
      if (!locked && !isDrawing) {
        history.clear();
      }
    },
  }));

  // useMemo is required so that the same reference persists
  // and the callback can be disabled with fabricjs
  const updatefn = useMemo(
    () => (e: IEvent) => {
      if (e.target.canvas) {
        history.draw(e.target.canvas.toObject());
      }
    },
    []
  );

  // triggered when history.present changes
  // ie either an event
  // or the
  useEffect(() => {
    // canvas not initialized
    if (!canvas || !canvas.current) {
      return;
    }

    // Draw event
    // no need to reconciliate since it came from the canvas itself
    if (!history.present || history.present.type === "DRAW") {
      return;
    }

    // start consolidation
    // ignore any events to avoid an infinite loop
    // TODO: find a way to stop the user from drawing
    canvas.current.off("object:added", updatefn);
    setLocked(true);

    canvas.current.loadFromJSON(history.present.data, () => {
      canvas.current.renderAll();

      // unlock
      canvas.current.on("object:added", updatefn);
      setLocked(false);
    });
  }, [history.present]);

  useEffect(() => {
    if (!canvas || !canvas.current) {
      return;
    }

    console.log("setting zoom to", zoomLevel);
    canvas.current.setZoom(zoomLevel);
  }, [zoomLevel]);

  useEffect(() => {
    const c = new fabric.Canvas(props.canvasID, {
      isDrawingMode: true,
      width: props.width,
      height: props.height,
    });

    let brush = new PSBrush(c);
    brush.width = 15;
    brush.color = "#000";
    c.freeDrawingBrush = brush;

    canvas.current = c;

    // when one is drawing, don't allow any other
    // event to happen
    c.on("mouse:down", () => {
      setIsDrawing(true);
    });

    c.on("mouse:up", () => {
      setIsDrawing(false);
    });

    // since we interact directly with the canvas
    // we must listen to events there and then push
    // to the history data structure
    c.on("object:added", updatefn);
  }, []);

  useEffect(() => {
    if (canvas.current) {
      canvas.current.setWidth(props.width);
      canvas.current.setHeight(props.height);
    }
  }, [props.width, props.height]);

  return (
    <div className={props.className}>
      <canvas id={props.canvasID}></canvas>
    </div>
  );
};

const PracticeCanvas = memo(forwardRef(PracticeCanvasComponent));
