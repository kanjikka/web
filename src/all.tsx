import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";

export default function All(props: { index: string[] }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Kanji Drawing Practice</title>
        <meta name="description" content="Kanji Drawing Practice appn" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>All Kanji</h1>

        <ul>
          {props.index.map((i) => (
            <li key={i}>
              <Link href={`draw/${i}`} prefetch={false}>
                <a>{i}</a>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
