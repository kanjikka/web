import { ForwardedRef, forwardRef, MutableRefObject, useRef } from "react";
import dynamic from "next/dynamic";
import { TileStructure } from "./TilesEngine";
import styles from "./Tiles.module.css";
import { PracticeCanvasHandle } from "./PracticeCanvas";
import { addBasePath } from "next/dist/client/add-base-path";

const PracticeCanvas = dynamic(() => import("./PracticeCanvas"), {
  ssr: false,
});

type TilesRenderProps = {
  tiles: TileStructure[];
  tileWidth: number;
  zoomLevel: number;
  assistEnabled: boolean;
};

export const TilesRenderer = forwardRef(function (
  props: TilesRenderProps,
  ref: ForwardedRef<PracticeCanvasHandle>
) {
  const { tiles, tileWidth, zoomLevel, assistEnabled } = props;

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
              ...findOutStyles(assistEnabled, c.character),
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

function findOutStyles(assistEnabled: boolean, character?: string) {
  const styles: React.CSSProperties = {};

  styles.backgroundImage = tileImg(assistEnabled, character);

  // It's a padding one
  if (!character) {
    styles.backgroundColor = "#80808017";
  }

  return styles;
}

function tileImg(assistEnabled: boolean, c?: string) {
  if (!assistEnabled || !c) {
    // TODO: unify this, maybe this url should come from the api
    const url = addBasePath("/kanji-template/template.svg");
    return `url(${url})`;
  }

  const url = addBasePath(`/kanji-template/${c}.svg`);
  return `url(${url})`;
}
