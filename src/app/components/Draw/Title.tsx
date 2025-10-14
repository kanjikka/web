import { getLink } from "@/svc/router";
import { Kanji } from "../models/kanji.schema";
import Link from "next/link";

export function Title(props: { chars: string[] }) {
  return (
    <h1>
      {props.chars.map((c, i) => {
        return (
          <Link
            key={`${c}-${i}`}
            href={getLink({
              name: "SHOW",
              query: c,
            })}
          >
            {c}
          </Link>
        );
      })}
    </h1>
  );
}
