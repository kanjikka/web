import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import Search from "./search/search";

export default function Home(props: { names: string[] }) {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <Head>
        <title>Kanji Drawing Practice</title>
        <meta name="description" content="Kanji Drawing Practice appn" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Practice Kanji Drawing</h1>
        <Search available={props.names} />
        <Link href="/all">
          <a>(see list of available characters)</a>
        </Link>
      </main>
    </div>
  );
}
