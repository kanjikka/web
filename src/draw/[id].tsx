import styles from "../../styles/draw.module.css";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import { Kanji } from "../models/kanji.schema";
import { useRouter } from "next/router";

const CHARACTER_WIDTH = 109;

// TODO: sync this with css
// responsive
const columns = {
  9999: 15,
  1526: 12,
  1417: 11,
  1308: 10,
  1199: 9,
  1090: 8,
  981: 7,
  872: 6,
  763: 5,
  654: 4,
  545: 3,
};

function getColumns(screenWidth: number) {
  // Sort by number
  const entries = Object.entries(columns).sort((a, b) => {
    return parseInt(a[0], 10) - parseInt(b[0], 10);
  });

  const found = entries.find((s) => {
    return screenWidth < parseInt(s[0], 10);
  });

  return found[1];
}

const KeyboardEventHandler = dynamic(
  () => import("react-keyboard-event-handler"),
  {
    ssr: false,
  }
);

const PracticeCanvas = dynamic(() => import("./PracticeCanvas"), {
  ssr: false,
});

function Sprite(props: { kanji: Kanji }) {
  const strokeCount = Math.floor(
    props.kanji.svg.width / props.kanji.svg.individualWidth
  );

  return (
    <div className={styles.sprite}>
      {Array.from(Array(strokeCount).keys()).map((i) => {
        console.log({ i });
        return (
          <div
            key={i}
            style={{
              backgroundImage: `url("/svg/${props.kanji.name}.svg")`,
              backgroundPositionX: `-${
                (i * props.kanji.svg.width) / strokeCount
              }px`,

              width: props.kanji.svg.width / strokeCount,
              height: props.kanji.svg.height,
            }}
          ></div>
        );
      })}
    </div>
  );
}

function Tiles(props: {
  word: string;
  canvasSize: { width: number; height: number };
  windowWidth: number;
}) {
  const { word, canvasSize, windowWidth } = props;
  let tiles = [];

  // If it's a single character
  //  if (word.length === 1) {
  //    throw new Error("huh?");
  //  }

  // TODO: hardcoded
  const tileArea = 109;
  const canvasArea = canvasSize.width * canvasSize.height;

  const columns = getColumns(windowWidth);

  let tilesNum = canvasArea / tileArea;
  //const tilesNum = 14;

  let wordPointer = 0;

  // TODO: set a maximum
  for (
    let i = 0;
    tiles.length < tilesNum; //      i++, wordPointer = wordPointer % columns

  ) {
    console.log("currently pointing to", word[wordPointer]);
    const index = (i % columns) % word.length;
    const c = word[wordPointer];
    // TODO: is this a valid way to index

    // If finished word and there's more columns
    // TODO: how do we distinguish we just finished a word or not?
    //if (wordPointer === 0 && i > 0) {
    if (wordPointer === word.length - 1) {
      console.log("we finished a word at", { i, index, wordPointer: c });

      // Write the last character then pad it
      tiles.push(
        <div
          style={{
            width: CHARACTER_WIDTH,
            height: CHARACTER_WIDTH,
            background: `url(/kanji-template/${c}.svg)`,
          }}
        ></div>
      );
      i++;
      wordPointer = (wordPointer + 1) % word.length;

      // Add one space
      // If we start over, will it fit in the same row?
      console.log(
        "i % columns",
        i % columns,
        "wordlength",
        word.length,
        "columns",
        columns
      );

      if ((i % columns) + word.length > columns) {
        // It's not gonna fit, so let's pad until row is finished
        const spacesRequired = columns - (i % columns);
        console.log("padding with", spacesRequired, "spaces");

        //console.log("going to the loop", i, columns);
        for (let j = 0; j < spacesRequired; j++) {
          console.log("padding", j);
          tiles.push(
            <div
              key={i}
              style={{
                width: CHARACTER_WIDTH,
                height: CHARACTER_WIDTH,
                background: `url(/kanji-template/ .svg)`,
              }}
            ></div>
          );
          i++;
        }
        continue;
      }
    }

    tiles.push(
      <div
        style={{
          width: CHARACTER_WIDTH,
          height: CHARACTER_WIDTH,
          background: `url(/kanji-template/${c}.svg)`,
        }}
      ></div>
    );
    i++;
    wordPointer = (wordPointer + 1) % word.length;
  }

  return <>{tiles}</>;
}

export default function Draw(props: { kanjis: Kanji[] }) {
  const router = useRouter();
  const canvasRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [assist, setAssist] = useState(false);
  const word = props.kanjis.map((a) => a.name).join("");

  useEffect(() => {
    const source = new EventSource("/stream");

    source.onmessage = function (e) {
      const kanji = (e as any).data;

      // TODO: look at route?
      const names = props.kanjis.map((a) => a.name);
      // TODO: validate it's a valid kanji
      //
      // Only refresh when the kanji actually changes
      if (kanji !== names) {
        router.push(`/draw/${kanji}`, null, {
          shallow: false,
        });
        router.reload();
      }
    };
  }, []);

  useEffect(() => {
    const setCanvasSizeFn = () => {
      if (canvasWrapRef && canvasWrapRef.current) {
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

  const guidedTemplate = [];

  // if it's a radical itself, don't show
  //  const madeOf =
  //    props.kanji.parts.length === 1 ? (
  //      ""
  //    ) : (
  //      <h4>made of {props.kanji.parts.map((a) => a)}</h4>
  //    );
  //
  const canvasBackground = [];
  if (assist && props.kanjis.length === 1) {
    canvasBackground.push(
      `repeat url(/kanji-template/${props.kanjis[0].name}.svg)`
    );
  }
  canvasBackground.push("repeat url(/template.svg)");

  return (
    <div className={styles.container}>
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
      <div className={styles.title}>
        <h1>{props.kanjis.map((a) => a.name).join("")}</h1>
      </div>
      <div className={styles.reference}>
        <h4>Reference:</h4>
        <div>
          {props.kanjis.map((k) => (
            <Sprite kanji={k} />
          ))}
        </div>
      </div>
      <div>
        <h4>Practice:</h4>

        <div>
          toolbar
          <button onClick={() => canvasRef?.current?.undo()}>undo</button>
          <button onClick={() => canvasRef?.current?.redo()}>redo</button>
          <button onClick={() => canvasRef?.current?.clear()}>clear</button>
          <button onClick={() => setAssist((prevAssist) => !prevAssist)}>
            Toggle assist
          </button>
        </div>
        <div
          ref={canvasWrapRef}
          className={styles.canvasContainer}
          style={{ background: canvasBackground.join(",") }}
        >
          <div id="guided-template" className={styles.spriteContainer}>
            {guidedTemplate.map((item) => item)}
          </div>
          <div id="tiles" className={styles.tiles}>
            {typeof window !== "undefined" && (
              <Tiles
                word={word}
                canvasSize={canvasSize}
                windowWidth={window.innerWidth}
              />
            )}
          </div>

          <PracticeCanvas
            forwardRef={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className={styles.canvas}
          ></PracticeCanvas>
        </div>
      </div>
    </div>
  );
}
