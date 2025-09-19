import Head from "next/head";
import styles from "../styles/Home.module.css";
import Search from "./search/search";

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

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Japanese Writing Practice</title>
        {/*
        <meta name="description" content="Kanji Drawing Practice appn" />
      */}
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Japanese Writing Practice</h1>
        <Search />
        {/*

        <Link href="/all">
          <a>(see list of available characters)</a>
        </Link>
          */}
      </main>
    </div>
  );
}
