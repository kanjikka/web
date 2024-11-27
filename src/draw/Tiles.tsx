import styles from "./Tiles.module.css";
import dynamic from "next/dynamic";
import React, {
  forwardRef,
  MutableRefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { TilesRenderer } from "./TilesRenderer";
import { TilesEngine } from "./TilesEngine";

const PracticeCanvas = dynamic(() => import("./PracticeCanvas"), {
  ssr: false,
});

export type TilesHandle = {
  clear: () => void;
};

export const Tiles = forwardRef(function (
  props: {
    word: string;
    tileWidth: number;
    canvasWidth: number;
    assistEnabled: boolean;
    zoomLevel: number;
  },
  ref
) {
  const canvasRef = useRef([]);

  useImperativeHandle(ref, () => ({
    clear: () => {
      canvasRef.current?.forEach((r) => {
        r.clear();
      });
    },
  }));

  if (!props.tileWidth || !props.canvasWidth || !props.word.length) {
    return <></>;
  }

  // Since on each render new refs will be added
  // We check if they exist first
  // Source: https://stackoverflow.com/a/70711046
  const setRef: (el) => void = (el) => {
    if (el && !canvasRef.current.includes(el)) {
      canvasRef.current.push(el);
    }
  };

  const tiles = TilesEngine({
    maxWidth: props.canvasWidth,
    tileWidth: props.tileWidth,
    word: props.word,
  });

  return (
    <TilesRenderer
      ref={setRef}
      tiles={tiles}
      assistEnabled={props.assistEnabled}
      tileWidth={props.tileWidth}
      zoomLevel={props.zoomLevel}
    />
  );
});

export const __Tiles = forwardRef(function (
  props: {
    word: string;
    tileWidth: number;
    canvasWidth: number;
    assistEnabled: boolean;
    zoomLevel: number;
  },
  // TODO: type
  ref: MutableRefObject<TilesHandle>
) {
  const canvasRef = useRef([]);
  const { assistEnabled, word, tileWidth, canvasWidth, zoomLevel } = props;
  const [numTiles, setNumTiles] = useState(0);

  let tiles = [];

  const columns = Math.floor(props.canvasWidth / tileWidth);

  useImperativeHandle(ref, () => ({
    clear: () => {
      canvasRef.current?.forEach((r) => {
        r.clear();
      });
    },
  }));

  useEffect(() => {
    const columns = Math.floor(props.canvasWidth / tileWidth);
    const numRows = Math.ceil(word.length / columns);
    const newTilesNum = numRows * columns;

    setNumTiles(newTilesNum);

    // TODO:
    // 2 constraints:
    // Not lose any data, and it fill missing tiles
    // So we need to check the last written tile
    // And take the max between sentence size and the last written tile

    //    if (columns && newTilesNum) {
    //      // Never reduce the number of tiles
    //      // Reasoning is that we don't want to lose information
    //      let maxNumTiles = Math.max(newTilesNum, numTiles);
    //      const res = maxNumTiles % columns;
    //      // Still have to fill
    //      console.log({
    //        res,
    //        columns,
    //        maxNumTiles,
    //      });
    //      if (res > 0) {
    //        console.log("adicionando", columns - res);
    //        maxNumTiles = maxNumTiles + (columns - res);
    //      }
    //
    //      console.log("new num tiles", maxNumTiles);
    //      setNumTiles(maxNumTiles);
    //    }
    //
    // TODO: fill with next multiple of the number of columns
  }, [canvasWidth, tileWidth]);

  //  function setRef(ref) {
  //    canvasRef.current.push(ref);
  //  }

  // Since on each render new refs will be added
  // We check if they exist first
  // Source: https://stackoverflow.com/a/70711046
  const setRef: (el) => void = (el) => {
    if (el && !canvasRef.current.includes(el)) {
      canvasRef.current.push(el);
    }
  };

  function tileImg(c?: string) {
    if (!assistEnabled || !c) {
      return "url(/kanji-template/template.svg)";
    }

    return `url(/kanji-template/${c}.svg)`;
  }

  function figureOutBorder(i: number) {
    const border = "1px solid #ddd";
    const styles: React.CSSProperties = {};

    // Left
    if (i % columns === 0) {
      styles.borderLeft = border;
    }
    if (i % columns == columns - 1) {
      styles.borderRight = border;
    }

    if (i >= 0 && i < columns) {
      styles.borderTop = border;
    }

    if (i >= numTiles - columns && i < numTiles) {
      styles.borderBottom = border;
    }

    return styles;
  }

  if (!numTiles) {
    return <></>;
  }

  if (!ref) {
    return <></>;
  }

  if (word.length === 1) {
    // Single kanji is easy, just fill everything
    const c = word[0];

    return (
      <>
        {Array.from(Array(numTiles).keys()).map((i) => {
          return (
            <div
              key={i}
              className={styles.tile}
              style={{
                ...figureOutBorder(i),
                backgroundImage: tileImg(c),
              }}
            >
              <PracticeCanvas
                canvasID={"canvas-" + i.toString()}
                forwardRef={setRef}
                width={tileWidth}
                height={tileWidth}
                zoomLevel={zoomLevel}
              ></PracticeCanvas>
            </div>
          );
        })}
      </>
    );
  }

  let wordPointer = 0;

  for (let i = 0, j = 0; tiles.length < numTiles; ) {
    const c = word[wordPointer];
    // TODO: is this a valid way to index

    // Finished word
    if (wordPointer === word.length - 1) {
      // Write the last character
      tiles.push(
        <div
          key={i}
          className={styles.tile}
          style={{
            ...figureOutBorder(i),
            width: tileWidth,
            height: tileWidth,
            backgroundImage: tileImg(c),
          }}
        >
          <PracticeCanvas
            canvasID={"canvas-" + i.toString()}
            forwardRef={setRef}
            width={tileWidth}
            height={tileWidth}
            zoomLevel={zoomLevel}
          ></PracticeCanvas>
        </div>
      );
      i++;
      wordPointer = (wordPointer + 1) % word.length;

      // Point ot the next character
      //wordPointer = (wordPointer + 1) % word.length;

      const startingAtNewLine = i % columns === 0;
      // If we start over, will it fit in the same row?
      const spacesRequired = columns - (i % columns);
      const paddingRequired = !startingAtNewLine && spacesRequired;

      // Padding until row is finished
      if (paddingRequired) {
        // Start at index 1, so that we can sum i + j
        // And get an unique id
        for (let j = 0; j < spacesRequired; j++) {
          const key = `${i}-${j}`;
          tiles.push(
            <div
              key={key}
              className={styles.tile}
              style={{
                ...figureOutBorder(i),
                width: tileWidth,
                height: tileWidth,
                backgroundImage: tileImg(),
              }}
            >
              <PracticeCanvas
                canvasID={"canvas-" + key}
                forwardRef={setRef}
                width={tileWidth}
                height={tileWidth}
                zoomLevel={zoomLevel}
              ></PracticeCanvas>
            </div>
          );
          i++;
          // }
          continue;
        }
      }
      continue;
    }

    tiles.push(
      <div
        key={i}
        className={styles.tile}
        style={{
          ...figureOutBorder(i),
          width: tileWidth,
          height: tileWidth,
          backgroundImage: tileImg(c),
        }}
      >
        <PracticeCanvas
          canvasID={"canvas-" + i.toString()}
          forwardRef={setRef}
          width={tileWidth}
          height={tileWidth}
          zoomLevel={zoomLevel}
        ></PracticeCanvas>
      </div>
    );
    i++;
    wordPointer = (wordPointer + 1) % word.length;
  }

  return <>{tiles}</>;
});
