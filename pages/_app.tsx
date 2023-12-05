import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";

function useSync(router: ReturnType<typeof useRouter>) {
  useEffect(() => {
    const source = new EventSource("/stream");

    source.onmessage = function (e) {
      const kanji = (e as any).data;

      // Only refresh when the content actually changes
      if (router.pathname !== "/draw/[id]" || router.query.id !== kanji) {
        router.push(`/draw/${kanji}`, null, {
          shallow: false,
        });
      }
    };

    return () => {
      source.close();
    };
  }, [router]);
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useSync(router);

  return <Component {...pageProps} />;
}
