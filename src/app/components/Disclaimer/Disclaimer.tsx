import { TopBar } from "@/app/components/Draw/TopBar/TopBar";
import { Recoleta } from "@/app/fonts/Fonts";
import styles from "./Disclaimer.module.css";
import AlligatorImg from "./alligator.svg";
import Link from "next/link";
import Image from "next/image";

export function Disclaimer() {
  return (
    <section>
      <TopBar />
      <main className={`container ${styles.main}`}>
        <h1 className={`${Recoleta.className} ${styles.title}`}>Disclaimer</h1>

        <div className={styles.block}>
          <p>
            First of all, many thanks to all the projects we depend on (non
            exhaustive list):
          </p>
        </div>

        <div className={styles.block}>
          <h2 className={`${Recoleta.className} ${styles.heading2}`}>
            Stroke Order Images
          </h2>
          <p>
            The Images with Stroke order were originally from{" "}
            <Link href="https://jisho.org/">Jisho</Link>, which we modified
            slightly. Jisho in turn, originally got them from the{" "}
            <Link href="https://kanjivg.tagaini.net/">KanjiVG project.</Link>
          </p>
        </div>

        <div className={styles.block}>
          <h2 className={`${Recoleta.className} ${styles.heading2}`}>
            Guarantees
          </h2>
          <p>
            Although there's <Link href="/how-it-works">data behind it</Link>,
            we do not provide any guarantees the method will in fact improve
            your learning abilities.
          </p>
        </div>

        <div className={styles.block}>
          <h2 className={`${Recoleta.className} ${styles.heading2}`}>Images</h2>
          <p>
            Images were downloaded from{" "}
            <Link href="https://unsplash.com/">Unsplash.com</Link>
          </p>
        </div>

        <div className={styles.block}>
          <h2 className={`${Recoleta.className} ${styles.heading2}`}>
            Illustrations
          </h2>
          <p>
            All illustrations were done by ourselves using{" "}
            <Link href="https://inkscape.org/">Inkscape.</Link>
          </p>
        </div>

        <div className={styles.block}>
          <h2 className={`${Recoleta.className} ${styles.heading2}`}>
            Monetization and data privacy
          </h2>
          <p>
            We do not record any personal data. And there are no plans of
            monetization.
          </p>
        </div>

        <div className={styles.illustrationWrapper}>
          <Image
            src={AlligatorImg}
            alt="An alligator"
            width="356"
            height="88"
          />
        </div>
      </main>
    </section>
  );
}
