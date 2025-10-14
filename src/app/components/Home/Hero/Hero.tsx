import Search from "@/app/components/Search/search";
import HeroImage from "./Hero.jpg";
import Image from "next/image";
import { Recoleta } from "@/app/fonts/Fonts";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <div className={styles.hero}>
      <Image src={HeroImage} alt="" fill className={styles.heroImage} />
      <div className="container">
        <h1 className={`${Recoleta.className} ${styles.heroTitle}`}>
          Lookup kanji stroke order
        </h1>
        <div>
          <Search />
        </div>
      </div>
    </div>
  );
}
