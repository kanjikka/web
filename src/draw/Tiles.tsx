import styles from "./Tiles.module.css";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";

const PracticeCanvas = dynamic(() => import("./PracticeCanvas"), {
  ssr: false,
});

export function Tiles(props: {
  word: string;
  tileWidth: number;
  canvasWidth: number;
  windowWidth: number;
  assistEnabled: boolean;
}) {
  const { assistEnabled, word, tileWidth } = props;

  let tiles = [];

  const columns = Math.floor(props.canvasWidth / tileWidth);

  // TODO: figure this out, since it depends on other factors
  //const tilesNum = columns * 7;
  const tilesNum = 1;

  function tileImg(c?: string) {
    if (assistEnabled || !c) {
      return "url(/kanji-template/template.svg)";
    }

    return `url(/kanji-template/${c}.svg)`;
  }

  function findBorder(i: number) {
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

    if (i >= tilesNum - columns && i < tilesNum) {
      styles.borderBottom = border;
    }

    return styles;
  }

  if (!tilesNum) {
    return <></>;
  }

  const canvasRef = useRef(null);
  const canvasWrapRef = useRef(null);

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
                ...findBorder(a),
                backgroundImage: tileImg(c),
              }}
            >
              <button
                style={{ position: "absolute", zIndex: 999 }}
                onClick={() => {
                  canvasRef.current.setZoom(1.21);
                }}
              >
                Test
              </button>
              <PracticeCanvas
                canvasID={"canvas-" + a.toString()}
                forwardRef={canvasRef}
                width={tileWidth}
                height={tileWidth}
              ></PracticeCanvas>
            </div>
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
            ...findBorder(i),
            width: tileWidth,
            height: tileWidth,
            backgroundImage: tileImg(c),
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
                ...findBorder(i),
                width: tileWidth,
                height: tileWidth,
                backgroundImage: tileImg(),
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
          ...findBorder(i),
          width: tileWidth,
          height: tileWidth,
          backgroundImage: tileImg(c),
        }}
      ></div>
    );
    i++;
    wordPointer = (wordPointer + 1) % word.length;
  }

  return <>{tiles}</>;
}
