import styles from "../../styles/draw.module.css";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import { Kanji } from "../models/kanji.schema";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSyncContext } from "../../pages/sync";

// TODO: not the most optimal way
function findDivisors(n: number) {
  const THRESHOLD = 3;
  const divisors = [];

  for (let i = 1; i <= n; i++) {
    const res = n % i;
    if (res >= 0 && res <= THRESHOLD) {
      divisors.push(i);
    }
  }

  return divisors;
}

function filterBetween(lower: number, higher: number, arr: number[]) {
  return arr.filter((a) => a >= lower && a <= higher);
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

export default function Draw(props: { kanjis: Kanji[] }) {
  const router = useRouter();
  const canvasRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [assist, setAssist] = useState(true);
  const [tileWidthHeight, setTileWidthHeight] = useState(109);
  const word = props.kanjis.map((a) => a.name).join("");
  const { syncConfig, toggleLocked } = useSyncContext();

  async function syncOtherDevices() {
    // Tell the server this page has been loaded
    fetch(`/change-route?kanji=${word}`);
  }

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

  const guidedTemplate = [];

  // This is faster, but it's an optimization
  const canvasBackground = [];
  //  if (assist && props.kanjis.length === 1) {
  //    canvasBackground.push(
  //      `repeat url(/kanji-template/${props.kanjis[0].name}.svg)`
  //    );
  //  }
  //  canvasBackground.push("repeat url(/template.svg)");

  // Clear canvas when word changes
  useEffect(() => {
    canvasRef.current?.clear();
  }, [word]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--tile-width",
      `${tileWidthHeight}px`
    );
    document.documentElement.style.setProperty(
      "--tile-height",
      `${tileWidthHeight}px`
    );
  }, [tileWidthHeight]);

  const divisors = filterBetween(50, 200, findDivisors(canvasSize.width));
  console.log("all divisors without filtering", findDivisors(canvasSize.width));

  useEffect(() => {
    // TODO: set a default...
    // In fact it should be as close as possible to the real size
    if (canvasSize.width > 0) {
      const median = divisors[Math.floor(divisors.length / 2)];
      console.log("median", median);
      console.log("all divosors of", canvasSize.width, divisors);
      setTileWidthHeight(median);
    }
  }, [canvasSize.width]);

  return (
    <div className={styles.container}>
      {/* More strict logic to go back to the main page if there's nothing in history */}
      <button onClick={() => router.back()}>Go Back</button>
      <Link href="/">Go to home page</Link>

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
        <Title characters={props.kanjis} />
      </div>
      <div className={styles.reference}>
        <h4>Reference:</h4>
        <div>
          <Tutorial characters={props.kanjis} />
        </div>
      </div>
      <div>
        <h4>Practice:</h4>

        {/* toolbar */}
        <div>
          <button onClick={() => canvasRef?.current?.undo()}>undo</button>
          <button onClick={() => canvasRef?.current?.redo()}>redo</button>
          <button onClick={() => canvasRef?.current?.clear()}>clear</button>
          <button onClick={() => setAssist((prevAssist) => !prevAssist)}>
            Toggle assist
          </button>
          <button onClick={() => syncOtherDevices()}>
            Send to other devices
          </button>
          <button onClick={() => toggleLocked()}>
            {syncConfig.locked ? "Enable" : "Disable"} Sync
          </button>
          {tileWidthHeight}
          <button
            onClick={() => {
              // Find current size
              const i = divisors.findIndex((a) => a === tileWidthHeight);
              if (i > 0) {
                setTileWidthHeight(divisors[i - 1]);
              }
            }}
          >
            -
          </button>
          <button
            onClick={() => {
              // Find current size
              const i = divisors.findIndex((a) => a === tileWidthHeight);
              if (i < divisors.length - 1) {
                setTileWidthHeight(divisors[i + 1]);
              }
            }}
          >
            +
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
          <div style={{ border: "1px solid #ddd" }}>
            <div id="tiles" className={styles.tiles}>
              {typeof window !== "undefined" && assist && (
                <Tiles
                  tileWidthHeight={tileWidthHeight}
                  word={word}
                  canvasSize={canvasSize}
                  windowWidth={window.innerWidth}
                />
              )}
            </div>
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

function Title(props: { characters: Kanji[] }) {
  return (
    <h1>
      {props.characters.map((c, i) => {
        return (
          <Link key={`${c.name}-${i}`} href={`/draw/${c.name}`}>
            {c.name}
          </Link>
        );
      })}
    </h1>
  );
}

// that explanation component
function Tutorial(props: { characters: Kanji[] }) {
  // Unique, O(n**2)
  const kanjisUnique = props.characters.filter(
    (c, i, arr) => arr.findIndex((a) => a.name == c.name) === i
  );

  return (
    <>
      {kanjisUnique.map((k) => (
        <div key={k.name}>
          <h2>
            <Link href={`/draw/${k.name}`}>{k.name}</Link>
          </h2>
          <TutorialTile key={k.name} kanji={k} />
        </div>
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
  tileWidthHeight: number;
  canvasSize: { width: number; height: number };
  windowWidth: number;
}) {
  const { word, windowWidth, tileWidthHeight } = props;

  let tiles = [];

  const columns = Math.floor(props.canvasSize.width / tileWidthHeight);

  // TODO: figure this out, since it depends on other factors
  const tilesNum = columns * 7;
  if (!tilesNum) {
    return <></>;
  }

  //  console.log({
  //    canvasArea,
  //    canvasMultiplied: props.canvasSize.width * props.canvasSize.height,
  //  });

  if (word.length === 1) {
    // Single kanji is easy, just fill everything
    const c = word[0];

    return (
      <>
        {Array.from(Array(tilesNum).keys()).map((a) => {
          return (
            <div
              key={a}
              className={styles.tile}
              style={{
                backgroundImage: `url(/kanji-template/${c}.svg)`,
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
          className={styles.tile}
          style={{
            width: tileWidthHeight,
            height: tileWidthHeight,
            backgroundImage: `url(/kanji-template/${c}.svg)`,
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
              className={styles.tile}
              style={{
                width: tileWidthHeight,
                height: tileWidthHeight,
                //                backgroundImage: `url(/kanji-template/ .svg)`,
                backgroundImage: "url(/kanji-template/template.svg)",
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
        className={styles.tile}
        style={{
          width: tileWidthHeight,
          height: tileWidthHeight,
          backgroundImage: `url(/kanji-template/${c}.svg)`,
        }}
      ></div>
    );
    i++;
    wordPointer = (wordPointer + 1) % word.length;
  }

  return <>{tiles}</>;
}
