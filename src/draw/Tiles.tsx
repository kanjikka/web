import styles from "./Tiles.module.css";

export function Tiles(props: {
  word: string;
  tileWidth: number;
  canvasWidth: number;
  windowWidth: number;
}) {
  const { word, tileWidth } = props;

  let tiles = [];

  const columns = Math.floor(props.canvasWidth / tileWidth);

  // TODO: figure this out, since it depends on other factors
  const tilesNum = columns * 7;

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
                ...findBorder(a),
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
            ...findBorder(i),
            width: tileWidth,
            height: tileWidth,
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
                ...findBorder(i),
                width: tileWidth,
                height: tileWidth,
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
          ...findBorder(i),
          width: tileWidth,
          height: tileWidth,
          backgroundImage: `url(/kanji-template/${c}.svg)`,
        }}
      ></div>
    );
    i++;
    wordPointer = (wordPointer + 1) % word.length;
  }

  return <>{tiles}</>;
}
