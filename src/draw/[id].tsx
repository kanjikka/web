import styles from "../../styles/draw.module.css";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import { Kanji } from "../models/kanji.schema";
import { useRouter } from "next/router";

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

export default function Draw(props: { kanji: Kanji }) {
  const router = useRouter();
  const canvasRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [assist, setAssist] = useState(false);

  //  const [dimensions, setDimensions] = React.useState({
  //    height: 0,
  //    width: 0,
  //  });
  const strokeCount = Math.floor(
    props.kanji.svg.width / props.kanji.svg.individualWidth
  );

  //  React.useEffect(() => {
  //    function handleResize() {
  //      setDimensions({
  //        height: window.innerHeight,
  //        width: window.innerWidth,
  //      });
  //    }
  //
  //    window.addEventListener("resize", handleResize);
  //  }, []);

  let tiles = [];

  // TODO: we know how many columns we have (it's in the css)
  // so we can pad in the end
  if (canvasSize.width) {
    //    const word = `友達付き合い `;
    //    const word = `ともだち `;
    const word = `ともだちがいぼびぼ`;
    // Assuming it's square, and that each kanji has same width which is wrong
    const tileArea =
      props.kanji.svg.individualWidth * props.kanji.svg.individualWidth;
    const canvasArea = canvasSize.width * canvasSize.height;

    const columns = getColumns(window.innerWidth);
    console.log("gonna use", columns, "columns");

    let tilesNum = canvasArea / tileArea;
    //const tilesNum = 14;

    let wordPointer = 0;

    for (
      let i = 0;
      tiles.length < tilesNum; //      i++, wordPointer = wordPointer % columns

    ) {
      console.log("currently pointing to", word[wordPointer]);
      const index = (i % columns) % word.length;
      const c = word[wordPointer];
      // TODO: is this a valid way to index

      // If finished word and there's more columns
      // TODO: how do we distinguish we just finished a word or not?
      //if (wordPointer === 0 && i > 0) {
      if (wordPointer === word.length - 1) {
        console.log("we finished a word at", { i, index, wordPointer: c });

        // Write the last character then pad it
        tiles.push(
          <div
            style={{
              width: props.kanji.svg.individualWidth,
              height: props.kanji.svg.individualWidth,
              background: `url(/kanji-template/${c}.svg)`,
            }}
          ></div>
        );
        i++;
        wordPointer = (wordPointer + 1) % word.length;

        // Add one space
        // If we start over, will it fit in the same row?
        console.log(
          "i % columns",
          i % columns,
          "wordlength",
          word.length,
          "columns",
          columns
        );

        if ((i % columns) + word.length > columns) {
          // It's not gonna fit, so let's pad until row is finished
          const spacesRequired = columns - (i % columns);
          console.log("padding with", spacesRequired, "spaces");

          //console.log("going to the loop", i, columns);
          for (let j = 0; j < spacesRequired; j++) {
            console.log("padding", j);
            tiles.push(
              <div
                key={i}
                style={{
                  width: props.kanji.svg.individualWidth,
                  height: props.kanji.svg.individualWidth,
                  background: `url(/kanji-template/ .svg)`,
                }}
              ></div>
            );
            i++;
          }
          continue;
          //console.log("columns - i", columns - i);
          //          tilesNum = tilesNum - (columns - i);
        }
      }

      tiles.push(
        <div
          style={{
            width: props.kanji.svg.individualWidth,
            height: props.kanji.svg.individualWidth,
            background: `url(/kanji-template/${c}.svg)`,
          }}
        ></div>
      );
      i++;
      wordPointer = (wordPointer + 1) % word.length;
    }
  }

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
          <div id="tiles" className={styles.tiles}>
            {tiles.map((item) => item)}
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
