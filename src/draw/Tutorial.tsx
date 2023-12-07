import { Kanji } from "../models/kanji.schema";
import Link from "next/link";
import styles from "./Tutorial.module.css";

// that explanation component
export function Tutorial(props: { characters: Kanji[] }) {
  // Unique, O(n**2)
  const kanjisUnique = props.characters.filter(
    (c, i, arr) => arr.findIndex((a) => a.name == c.name) === i
  );

  return (
    <>
      {kanjisUnique.map((k) => (
        <div key={k.name}>
          <h2>
            <Link href={`/draw/${k.name}`}>{k.name}</Link>
          </h2>
          <TutorialTile key={k.name} characters={k} />
        </div>
      ))}
    </>
  );
}

function TutorialTile(props: { characters: Kanji }) {
  const strokeCount = Math.floor(
    props.characters.svg.width / props.characters.svg.individualWidth
  );

  return (
    <div className={styles.sprite}>
      {Array.from(Array(strokeCount).keys()).map((i) => {
        return (
          <div
            key={i}
            style={{
              backgroundImage: `url("/svg/${props.characters.name}.svg")`,
              backgroundPositionX: `-${
                (i * props.characters.svg.width) / strokeCount
              }px`,

              width: props.characters.svg.width / strokeCount,
              height: props.characters.svg.height,
            }}
          ></div>
        );
      })}
    </div>
  );
}
