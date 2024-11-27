import styles from "../../styles/draw.module.css";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import { Kanji } from "../models/kanji.schema";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSyncContext, sendToOtherDevices } from "../../pages/sync";
import { Tiles, TilesHandle } from "./Tiles";
import { Tutorial } from "./Tutorial";
import { Title } from "./Title";
//import { KeyboardHandler } from "./Keyboard";
import { Toolbar } from "./Toolbar";
import { useZoom } from "./useZoom";
import { useCanvasObserver } from "./useCanvasObserver";
import { ExampleSentence } from "../models/exampleSentence.schema";
import { ExampleSentences } from "./ExampleSentence";
import Search from "../search/search";
import { getAllCharacters, getKanji } from "../svc/kanji";

const PracticeCanvas = dynamic(() => import("./PracticeCanvas"), {
  ssr: false,
});

export default function Draw() {
  const tilesRef = useRef<TilesHandle>();
  const router = useRouter();
  const query = router.query.id as string;

  const canvasRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const { canvasWidth, canvasHeight } = useCanvasObserver({
    canvasWrapRef,
  });
  const [assist, setAssist] = useState(true);
  const { syncConfig, toggleLocked } = useSyncContext();
  const { tileWidth, zoomIn, zoomOut, canZoomIn, canZoomOut, zoomLevel } =
    useZoom({
      canvasWidth,
    });

  const [kanjis, setKanjis] = useState<Kanji[]>([]);

  // Clear canvas when word changes
  useEffect(() => {
    tilesRef.current?.clear();
  }, [query]);

  useEffect(() => {
    async function load() {
      if (Array.isArray(query)) {
        throw new Error("Multiple Queries in URL");
      }
      const res = await getAllCharacters(query);
      setKanjis(res);
    }

    load();
  }, [query]);

  return (
    <div className={styles.container}>
      {/* More strict logic to go back to the main page if there's nothing in history */}
      <button onClick={() => router.back()}>Go Back</button>
      <Link href="/">Go to home page</Link>

      <div>
        <Search available={[]} />
      </div>

      <div className={styles.title}>
        <Title chars={query.split("")} />
      </div>
      <div className={styles.reference}>
        <details>
          <summary>
            <h4 style={{ display: "inline-block" }}>Tutorial:</h4>
          </summary>

          <Tutorial characters={kanjis} />
        </details>
      </div>
      <div>
        <h4>Practice:</h4>

        <Toolbar
          onClear={() => {
            tilesRef.current?.clear();
            // TODO: figure out why r is sometimes null
            //tilesRef.current.forEach((r, i) => {
            //  if (r) {
            //    r.clear();
            //  }
            //});
          }}
          canvasRef={canvasRef}
          toggleAssist={() => setAssist((prevAssist) => !prevAssist)}
          sync={() => {
            /*sendToOtherDevices(word) */
          }}
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
                  word={query}
                  assistEnabled={assist}
                  canvasWidth={canvasWidth}
                />
              )}
            </div>
          </div>

          {/*

          <KeyboardHandler canvasRef={canvasRef} />
            */}
          {/*
          <PracticeCanvas
            canvasID="canvas"
            /orwardRef={canvasRef}
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
