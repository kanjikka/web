"use client";

import styles from "../../styles/draw.module.css";
import React, { useEffect, useRef, useState } from "react";
import { Kanji } from "../models/kanji.schema";
import Link from "next/link";
import { Tiles, TilesHandle } from "./Tiles";
import { Tutorial } from "./Tutorial";
import { Title } from "./Title";
import { Toolbar } from "./Toolbar";
import { useZoom } from "./useZoom";
import { useCanvasObserver } from "./useCanvasObserver";
import Search from "../search/search";
import { getLink } from "@/svc/router";

type DrawProps = {
  characters: Kanji[];
  query: string;
};
export default function Draw(props: DrawProps) {
  const { characters, query } = props;

  const tilesRef = useRef<TilesHandle>();
  const canvasRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const { canvasWidth } = useCanvasObserver({
    canvasWrapRef,
  });
  const [assist, setAssist] = useState(true);
  const { tileWidth, zoomIn, zoomOut, canZoomIn, canZoomOut, zoomLevel } =
    useZoom({
      canvasWidth,
    });

  // Clear canvas when word changes
  useEffect(() => {
    tilesRef.current?.clear();
  }, [query]);

  return (
    <div className={styles.container}>
      {/* TODO: More strict logic to go back to the main page if there's nothing in history */}
      <Link href={getLink({ name: "HOME" })}>Go to home page</Link>

      <div>
        <Search />
      </div>

      <div className={styles.title}>
        <Title chars={query.split("")} />
      </div>
      <div className={styles.reference}>
        <details>
          <summary>
            <h4 style={{ display: "inline-block" }}>Tutorial:</h4>
          </summary>

          <Tutorial characters={characters} />
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
          isLocked={false}
          toggleLocked={() => {}}
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
