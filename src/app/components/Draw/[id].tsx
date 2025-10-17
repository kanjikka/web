import styles from "./draw.module.css";
import { Kanji } from "@/models/kanji.schema";
import { Tutorial } from "./Tutorial";
import { TopBar } from "@/app/components/Draw/TopBar/TopBar";
import { Recoleta } from "@/app/fonts/Fonts";

type DrawProps = {
  characters: Kanji[];
  query: string;
};
export default function Draw(props: DrawProps) {
  const { characters, query } = props;

  return (
    <section>
      <TopBar />
      <main className={`container ${styles.main}`}>
        {/* TODO: More strict logic to go back to the main page if there's nothing in history 
        <Link href={getLink({ name: "HOME" })}>Go to home page</Link>
          */}

        <h2 className={`${Recoleta.className} ${styles.title}`}>
          Stroke Order
        </h2>

        <h3 className={styles.query}>{decodeURI(query)}</h3>
        <div className={styles.reference}>
          <Tutorial characters={characters} />
        </div>
      </main>
    </section>
  );
}
