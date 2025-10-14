"use client";

import styles from "./draw.module.css";
import { Kanji } from "@/models/kanji.schema";
import Link from "next/link";
import { Tutorial } from "./Tutorial";
import { Title } from "./Title";
import Search from "@/app/components/Search/search";
import { getLink } from "@/svc/router";

type DrawProps = {
  characters: Kanji[];
  query: string;
};
export default function Draw(props: DrawProps) {
  const { characters, query } = props;

  return (
    <div className={styles.container}>
      {/* TODO: More strict logic to go back to the main page if there's nothing in history */}
      <Link href={getLink({ name: "HOME" })}>Go to home page</Link>

      <div>
        <Search />
      </div>

      <div className={styles.title}>
        <Title chars={query.split("")} />
      </div>
      <div className={styles.reference}>
        <h4 style={{ display: "inline-block" }}>Tutorial:</h4>

        <Tutorial characters={characters} />
      </div>
    </div>
  );
}
