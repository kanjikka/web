import Link from "next/link";
import Crabgator from "./CrabGator.svg";
import styles from "./WaniKani.module.css";
import Image from "next/image";
import { Recoleta } from "@/app/fonts/Fonts";

export function WaniKani() {
  return (
    <section className={`${styles.section}`}>
      <div className={`${styles.wrapper} container`}>
        <div className={styles.textSection}>
          <h2 className={`${Recoleta.className} ${styles.sectionTitle}`}>
            The Perfect Companion to WaniKani
          </h2>

          <p className={styles.text}>
            Pair up with WaniKani learning by using our{" "}
            <Link href="#">TamperMonkey extension</Link>, so that it shows up
            automatically in WaniKani!
          </p>
        </div>

        <div>
          <Image
            src={Crabgator}
            width="460"
            height="410"
            alt="WaniKani character called Crabgator, which is a fusion of a crab and an alligator"
          />
        </div>
      </div>
    </section>
  );
}
