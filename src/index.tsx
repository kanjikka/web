import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Search from "./search/search";
import { useEffect } from "react";
import { useRouter } from "next/router";

//function useSync() {
//  useEffect(() => {
//    const source = new EventSource("/stream");
//
//    source.onmessage = function (e) {
//      const kanji = (e as any).data;
//
//      // Only refresh when the content actually changes
//      if (kanji !== word) {
//        router.push(`/draw/${kanji}`, null, {
//          shallow: false,
//        });
//      }
//    };
//
//    return () => {
//      source.close();
//    };
//  }, [word]);
//}

export default function Home(props: { names: string[] }) {
  const router = useRouter();

  console.log("router pathname", router.pathname);
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
