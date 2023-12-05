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

// that explanation component
function Tutorial(props: { kanjis: Kanji[] }) {
  // Unique
  const kanjisUnique = [...new Set(props.kanjis)];

  return (
    <>
      {kanjisUnique.map((k) => (
        <TutorialTile key={k.name} kanji={k} />
      ))}
    </>
  );
}

function TutorialTile(props: { kanji: Kanji }) {
  const strokeCount = Math.floor(
    props.kanji.svg.width / props.kanji.svg.individualWidth
  );

  return (
    <div className={styles.sprite}>
      {Array.from(Array(strokeCount).keys()).map((i) => {
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
  const { word, windowWidth } = props;

  let tiles = [];

  // TODO: hardcoded
  const columns = getColumns(windowWidth);
  const canvasArea = props.canvasSize.width * props.canvasSize.height;
  const tileArea = 109 * 109;

  // TODO: figure this out, since it depends on other factors
  const tilesNum = canvasArea / tileArea;

  console.log({
    canvasArea,
    canvasMultiplied: props.canvasSize.width * props.canvasSize.height,
  });

  if (word.length === 1) {
    // Single kanji is easy, just fill everything
    const c = word[0];

    return (
      <>
        {Array.from(Array(tilesNum).keys()).map((a) => {
          return (
            <div
              key={a}
              style={{
                width: CHARACTER_WIDTH,
                height: CHARACTER_WIDTH,
                background: `url(/kanji-template/${c}.svg)`,
              }}
            />
          );
        })}
      </>
    );
  }

  let wordPointer = 0;

  for (let i = 0; tiles.length < tilesNum; ) {
    const c = word[wordPointer];
    // TODO: is this a valid way to index

    // Finished word
    if (wordPointer === word.length - 1) {
      // Write the last character
      tiles.push(
        <div
          key={i}
          style={{
            width: CHARACTER_WIDTH,
            height: CHARACTER_WIDTH,
            background: `url(/kanji-template/${c}.svg)`,
          }}
        ></div>
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
        for (let j = 0; j < spacesRequired; j++) {
          tiles.push(
            <div
              key={`${i}-${j}`}
              style={{
                width: CHARACTER_WIDTH,
                height: CHARACTER_WIDTH,
                background: `url(/kanji-template/ .svg)`,
              }}
            ></div>
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
  const [assist, setAssist] = useState(true);
  const word = props.kanjis.map((a) => a.name).join("");

  async function syncOtherDevices() {
    // Tell the server this page has been loaded
    fetch(`/change-route?kanji=${word}`);
  }

  useEffect(() => {
    const source = new EventSource("/stream");

    source.onmessage = function (e) {
      const kanji = (e as any).data;

      // Only refresh when the content actually changes
      if (kanji !== word) {
        router.push(`/draw/${kanji}`, null, {
          shallow: false,
        });
      }
    };

    return () => {
      source.close();
    };
  }, [word]);

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

  // This is faster, but it's an optimization
  const canvasBackground = [];
  //  if (assist && props.kanjis.length === 1) {
  //    canvasBackground.push(
  //      `repeat url(/kanji-template/${props.kanjis[0].name}.svg)`
  //    );
  //  }
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
          <Tutorial kanjis={props.kanjis} />
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
          <button onClick={() => syncOtherDevices()}>
            Send to other devices
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
            {typeof window !== "undefined" && assist && (
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
