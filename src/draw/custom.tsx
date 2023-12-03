import styles from "../../styles/draw.module.css";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import { Svg } from "../models/kanji.schema";
import Search from "../search/search";

const KeyboardEventHandler = dynamic(
  () => import("react-keyboard-event-handler"),
  {
    ssr: false,
  }
);

const PracticeCanvas = dynamic(() => import("./PracticeCanvas"), {
  ssr: false,
});

export default function Draw(props: {
  available: string[];
  svg: (Svg & { name: string })[];
}) {
  const canvasRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

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

  const guidedTemplate = props.svg.map((kanji) => {
    // TODO use stroke count when available
    const width = kanji.individualWidth;
    const backgroundPositionX = kanji.individualWidth;
    //    const backgroundPositionX = kanji.strokeCount
    //      ? kanji.svg.width / kanji.strokeCount
    //      : kanji.svg.width - 109;
    return (
      <div
        key={kanji.name}
        style={{
          backgroundImage: `url("/svg/${kanji.name}.template.svg")`,
          backgroundPositionX: `${backgroundPositionX}px`,

          width: width,
          height: kanji.height,
        }}
      ></div>
    );
  });
  //  for (let i = 0; i < props.kanji.strokeCount; i++) {
  //    guidedTemplate.push(
  //      <div
  //        key={i}
  //        style={{
  //          backgroundImage: `url("/svg/${props.kanji.name}.template.svg")`,
  //          backgroundPositionX: `-${
  //            (i * props.kanji.svg.width) / props.kanji.strokeCount
  //          }px`,
  //
  //          width: props.kanji.svg.width / props.kanji.strokeCount,
  //          height: props.kanji.svg.height,
  //        }}
  //      ></div>
  //    );
  //  }
  //
  // if it's a radical itself, don't show
  //  const madeOf =
  //    props.kanji.parts.length === 1 ? (
  //      ""
  //    ) : (
  //      <h4>made of {props.kanji.parts.map((a) => a)}</h4>
  //    );
  const individual = props.svg.map((a) => {
    return <a href={`/draw/{a.name}${a.name}`}>{a.name}</a>;
  });

  const visited = [];
  const strokeOrder = props.svg.map((c) => {
    // TODO use stroke count when available
    //    const width = c.individualWidth;
    //    const backgroundPositionX = c.individualWidth;
    if (visited.includes(c.name)) {
      // skip duplicates
      return;
    }
    visited.push(c.name);

    const strokeCount = Math.floor(c.width / c.individualWidth);

    const kanjiSprite = [];
    for (let i = 0; i < strokeCount; i++) {
      kanjiSprite.push(
        <div
          key={i}
          style={{
            backgroundImage: `url("/svg/${c.name}.svg")`,
            backgroundPositionX: `-${(i * c.width) / strokeCount}px`,

            width: c.width / strokeCount,
            height: c.height,
          }}
        ></div>
      );
    }

    return (
      <div style={{ display: "flex", flexWrap: "wrap", marginBottom: "10px" }}>
        {kanjiSprite.map((a) => a)}
      </div>
    );
  });

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
      <div>
        <Search available={props.available} />
      </div>
      <div className={styles.title}>
        <h1>{props.svg.map((a) => a.name).join("")}</h1>
        study each character individually
        <h2>
          {props.svg.map((a) => {
            return (
              <span>
                <a href={`/draw/${a.name}`}>{a.name}</a>{" "}
              </span>
            );
          })}
        </h2>
      </div>

      <div>
        <h4>Stroke Order:</h4>
        <h2>{strokeOrder}</h2>
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
