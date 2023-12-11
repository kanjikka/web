import { Kanji } from "../models/kanji.schema";
import Link from "next/link";
import { ExampleSentence } from "../models/exampleSentence.schema";
import { useEffect, useRef } from "react";
import { PlayButton } from "./PlayButton";

export function Title(props: {
  characters: Kanji[];
  sentence: ExampleSentence;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {}, [audioRef.current?.pause]);

  if (props.sentence) {
    return (
      <>
        <h1>
          {props.sentence.japaneseSentence}
          <span>
            <PlayButton src={props.sentence.audioJapanese} />
          </span>
        </h1>
        <h2>{props.sentence.englishSentence}</h2>
      </>
    );
  }

  // Just a single kanji, we can most definitely show its meaning
  if (props.characters.length === 1) {
    return (
      <>
        <h1>{props.characters[0].name}</h1>
        <h2>{props.characters[0].jisho.meaning}</h2>
      </>
    );
  }

  return (
    <h1>
      {props.characters.map((c, i) => {
        return (
          <Link key={`${c.name}-${i}`} href={`/draw/${c.name}`}>
            {c.name}
          </Link>
        );
      })}
    </h1>
  );
}
