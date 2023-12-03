import styles from "../../styles/draw.module.css";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import { Kanji } from "../models/kanji.schema";

const KeyboardEventHandler = dynamic(
  () => import("react-keyboard-event-handler"),
  {
    ssr: false,
  }
);

const PracticeCanvas = dynamic(() => import("./PracticeCanvas"), {
  ssr: false,
});

export default function Draw(props: { kanji: Kanji }) {
  const canvasRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const strokeCount = Math.floor(
    props.kanji.svg.width / props.kanji.svg.individualWidth
  );

  useEffect(() => {
    const setCanvasSizeFn = () =>
      setCanvasSize({
        width: canvasWrapRef.current.offsetWidth,
        height: canvasWrapRef.current.offsetHeight,
      });

    // record listener
    window.addEventListener("resize", () => {
      setCanvasSizeFn();
    });
    // run for the first time
    setCanvasSizeFn();
  }, []);

  const kanjiSprite = [];
  const guidedTemplate = [];

  for (let i = 0; i < strokeCount; i++) {
    kanjiSprite.push(
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
  }

  for (let i = 0; i < strokeCount; i++) {
    guidedTemplate.push(
      <div
        key={i}
        style={{
          backgroundImage: `url("/svg/${props.kanji.name}.template.svg")`,
          backgroundPositionX: `-${
            (i * props.kanji.svg.width) / strokeCount
          }px`,

          width: props.kanji.svg.width / strokeCount,
          height: props.kanji.svg.height,
        }}
      ></div>
    );
  }

  // if it's a radical itself, don't show
  //  const madeOf =
  //    props.kanji.parts.length === 1 ? (
  //      ""
  //    ) : (
  //      <h4>made of {props.kanji.parts.map((a) => a)}</h4>
  //    );
  //
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
        <h1>{props.kanji.name}</h1>

        <h4>
          <a href={`https://kanji.koohii.com/study/kanji/${props.kanji.name}`}>
            kanji kooji link
          </a>
        </h4>

        <h4>
          <a href={`https://jisho.org/search/${props.kanji.name} %23words`}>
            jisho (words)
          </a>
        </h4>
        <h4>
          <a href={`https://jisho.org/search/${props.kanji.name} %23kanji`}>
            jisho (kanji)
          </a>
        </h4>
      </div>
      <div className={styles.reference}>
        <h4>Reference:</h4>
        <div className={styles.spriteContainer}>
          {kanjiSprite.map((item) => item)}
        </div>
      </div>
      <div>
        <h4>Practice:</h4>

        <div>
          toolbar
          <button onClick={() => canvasRef?.current?.undo()}>undo</button>
          <button onClick={() => canvasRef?.current?.redo()}>redo</button>
          <button onClick={() => canvasRef?.current?.clear()}>clear</button>
        </div>
        <div ref={canvasWrapRef} className={styles.canvasContainer}>
          <div id="guided-template" className={styles.spriteContainer}>
            {guidedTemplate.map((item) => item)}
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
