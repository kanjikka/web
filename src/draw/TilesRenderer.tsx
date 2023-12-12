import { ForwardedRef, forwardRef, MutableRefObject, useRef } from "react";
import dynamic from "next/dynamic";
import { TileStructure } from "./TilesEngine";
import styles from "./Tiles.module.css";
import { PracticeCanvasHandle } from "./PracticeCanvas";

const PracticeCanvas = dynamic(() => import("./PracticeCanvas"), {
  ssr: false,
});

type TilesRenderProps = {
  tiles: TileStructure[];
  tileWidth: number;
  zoomLevel: number;
};

export const TilesRenderer = forwardRef(function (
  props: TilesRenderProps,
  ref: ForwardedRef<PracticeCanvasHandle>
) {
  const { tiles, tileWidth, zoomLevel } = props;

  return (
    <>
      {tiles.map((c, i) => {
        return (
          <div
            key={i}
            className={styles.tile}
            style={{
              //...figureOutBorder(i),
              //width: tileWidth,
              //height: tileWidth,
              backgroundImage: tileImg(true, c.character),
            }}
          >
            <Canvas
              i={i}
              ref={ref}
              tileWidth={tileWidth}
              readOnly={c.readOnly}
              zoomLevel={zoomLevel}
            />
          </div>
        );
      })}
    </>
  );
});

const Canvas = forwardRef(function (
  props: {
    i: number;
    readOnly: boolean;
    tileWidth: number;
    zoomLevel: number;
  },
  ref: ForwardedRef<PracticeCanvasHandle>
) {
  const { readOnly, i, tileWidth, zoomLevel } = props;
  if (readOnly) {
    return <></>;
  }

  return (
    <PracticeCanvas
      canvasID={"canvas-" + i.toString()}
      forwardRef={ref}
      width={tileWidth}
      height={tileWidth}
      zoomLevel={zoomLevel}
    ></PracticeCanvas>
  );
});

function tileImg(assistEnabled: boolean, c?: string) {
  if (!assistEnabled || !c) {
    return "url(/kanji-template/template.svg)";
  }

  return `url(/kanji-template/${c}.svg)`;
}
