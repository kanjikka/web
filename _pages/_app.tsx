import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SyncSystem } from "./sync";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SyncSystem>
      <Component {...pageProps} />
    </SyncSystem>
  );
}
