import styles from "../../styles/draw.module.css";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import { Kanji } from "../models/kanji.schema";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSyncContext, sendToOtherDevices } from "../../pages/sync";
import { Tiles } from "./Tiles";
import { Tutorial } from "./Tutorial";
import { Title } from "./Title";
import { KeyboardHandler } from "./Keyboard";
import { Toolbar } from "./Toolbar";
import { useZoom } from "./useZoom";
import { useCanvasObserver } from "./useCanvasObserver";
import { ExampleSentence } from "../models/exampleSentence.schema";
import { ExampleSentences } from "./ExampleSentence";
import Search from "../search/search";

const PracticeCanvas = dynamic(() => import("./PracticeCanvas"), {
  ssr: false,
});

export default function Draw(props: {
  kanjis: Kanji[];
  exampleSentences: ExampleSentence[];
  sentence?: ExampleSentence;
}) {
  const tilesRef = useRef([]);
  const router = useRouter();
  const canvasRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const { canvasWidth, canvasHeight } = useCanvasObserver({
    canvasWrapRef,
    canvasRef,
  });
  const [assist, setAssist] = useState(true);
  const word = props.kanjis.map((a) => a.name).join("");
  const { syncConfig, toggleLocked } = useSyncContext();
  const { tileWidth, zoomIn, zoomOut, canZoomIn, canZoomOut, zoomLevel } =
    useZoom({
      canvasWidth,
    });

  // Clear canvas when word changes
  useEffect(() => {
    // canvasRef.current?.clear();
  }, [word]);

  useEffect(() => {
    console.log("tilesRef", tilesRef);
  }, [tilesRef.current]);

  return (
    <div className={styles.container}>
      {/* More strict logic to go back to the main page if there's nothing in history */}
      <button onClick={() => router.back()}>Go Back</button>
      <Link href="/">Go to home page</Link>

      <div>
        <Search available={[]} />
      </div>

      <div className={styles.title}>
        <Title characters={props.kanjis} sentence={props.sentence} />
      </div>
      <div className={styles.reference}>
        <details>
          <summary>
            <h4 style={{ display: "inline-block" }}>Tutorial:</h4>
          </summary>

          <Tutorial characters={props.kanjis} />
        </details>

        <ExampleSentences sentences={props.exampleSentences} />
      </div>
      <div>
        <h4>Practice:</h4>

        <Toolbar
          onClear={() => {
            // TODO: figure out why r is sometimes null
            tilesRef.current.forEach((r, i) => {
              if (r) {
                r.clear();
              }
            });
          }}
          canvasRef={canvasRef}
          toggleAssist={() => setAssist((prevAssist) => !prevAssist)}
          sync={() => sendToOtherDevices(word)}
          isLocked={syncConfig.locked}
          toggleLocked={toggleLocked}
          canZoomIn={canZoomIn}
          canZoomOut={canZoomOut}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
        />

        <div ref={canvasWrapRef} className={styles.canvasContainer}>
          <div>
            <div id="tiles" className={styles.tiles}>
              {typeof window !== "undefined" && (
                <Tiles
                  ref={tilesRef}
                  zoomLevel={zoomLevel}
                  tileWidth={tileWidth}
                  word={word}
                  assistEnabled={assist}
                  canvasWidth={canvasWidth}
                  windowWidth={window.innerWidth}
                />
              )}
            </div>
          </div>

          <KeyboardHandler canvasRef={canvasRef} />
          {/*
          <PracticeCanvas
            canvasID="canvas"
            forwardRef={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className={styles.canvas}
          ></PracticeCanvas>
            */}
        </div>
      </div>
    </div>
  );
}
