import { Kanji } from "../models/kanji.schema";
import Link from "next/link";
import styles from "./Tutorial.module.css";
import { getLink } from "@/svc/router";

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
            <Link href={getLink({ name: "SHOW", query: k.name })}>
              {k.name}
            </Link>
          </h2>
          <TutorialTile key={k.name} character={k} />
        </div>
      ))}
    </>
  );
}

function TutorialTile(props: { character: Kanji }) {
  const strokeCount = Math.floor(
    props.character.svg.width / props.character.svg.individualWidth
  );

  return (
    <div className={styles.sprite}>
      {Array.from(Array(strokeCount).keys()).map((i) => {
        return (
          <div
            key={i}
            style={{
              backgroundImage: `url("${props.character.svg.strokeOrderFilename}")`,
              backgroundPositionX: `-${
                (i * props.character.svg.width) / strokeCount
              }px`,

              width: props.character.svg.width / strokeCount,
              height: props.character.svg.height,
            }}
          ></div>
        );
      })}
    </div>
  );
}
