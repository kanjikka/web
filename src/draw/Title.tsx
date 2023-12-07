import { Kanji } from "../models/kanji.schema";
import Link from "next/link";

export function Title(props: { characters: Kanji[] }) {
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
