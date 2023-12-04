import styles from "../../styles/draw.module.css";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import { Kanji } from "../models/kanji.schema";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const canvasRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [assist, setAssist] = useState(true);

  console.log(assist);

  const strokeCount = Math.floor(
    props.kanji.svg.width / props.kanji.svg.individualWidth
  );

  useEffect(() => {
    const source = new EventSource("/stream");

    source.onmessage = function (e) {
      const kanji = (e as any).data;
      console.log({ kanji, name: props.kanji.name });
      // TODO: validate it's a valid kanji
      //
      // Only refresh when the kanji actually changes
      if (kanji !== props.kanji.name) {
        console.log("navigating");
        router.push(`/draw/${kanji}`, null, {
          shallow: false,
        });
        router.reload();
      }
    };
  }, []);

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

  // TODO: make this optoinal
  guidedTemplate.length = 0;

  // if it's a radical itself, don't show
  //  const madeOf =
  //    props.kanji.parts.length === 1 ? (
  //      ""
  //    ) : (
  //      <h4>made of {props.kanji.parts.map((a) => a)}</h4>
  //    );
  //
  const canvasBackground = [];
  if (assist) {
    canvasBackground.push(
      `repeat url(/kanji-template/${props.kanji.name}.svg)`
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
