import styles from "../../styles/draw.module.css";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import { Kanji } from "../models/kanji.schema";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSyncContext } from "../../pages/sync";
import { Tiles } from "./Tiles";
import { Tutorial } from "./Tutorial";
import { Title } from "./Title";
import { KeyboardHandler } from "./Keyboard";

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
  { ssr: false }
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

  // Since we will add borders to the first and last item
  // They also needed to be accounted for
  const canvasSizeWidth = canvasSize.width - 2;
  const divisors = filterBetween(50, 200, findDivisors(canvasSizeWidth));
  //  console.log("all divisors without filtering", findDivisors(canvasSize.width));

  useEffect(() => {
    // TODO: set a default...
    // In fact it should be as close as possible to the real size
    if (canvasSize.width > 0) {
      const median = divisors[Math.floor(divisors.length / 2)];
      setTileWidthHeight(median);
    }
  }, [canvasSize.width]);

  return (
    <div className={styles.container}>
      {/* More strict logic to go back to the main page if there's nothing in history */}
      <button onClick={() => router.back()}>Go Back</button>
      <Link href="/">Go to home page</Link>

      <div className={styles.title}>
        <Title characters={props.kanjis} />
      </div>
      <div className={styles.reference}>
        <h4>Tutorial:</h4>
        <Tutorial characters={props.kanjis} />
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
            Zoom out (-)
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
            Zoom In (+)
          </button>
        </div>
        <div ref={canvasWrapRef} className={styles.canvasContainer}>
          <div>
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

          <KeyboardHandler canvasRef={canvasRef} />
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
