import Search from "@/app/components/Search/search";
import HeroImage from "./Hero.jpg";
import Image from "next/image";
import { Recoleta } from "@/app/fonts/Fonts";
import { Logo } from "@/app/components/Logo/Logo";
import styles from "./Hero.module.css";
import Link from "next/link";

function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={`container ${styles.height100} ${styles.navContainer}`}>
        <Logo showText />
      </div>
    </nav>
  );
}
export function Hero() {
  return (
    <div className={styles.hero}>
      <Nav />
      <Image src={HeroImage} alt="" fill className={styles.heroImage} />

      <div className={`${styles.container} container`}>
        <h1 className={`${Recoleta.className} ${styles.heroTitle}`}>
          Lookup kanji stroke order
        </h1>
        <div>
          <Search />

          <Random />
        </div>
      </div>
    </div>
  );
}

function Random() {
  // We need to use <a> so that it nextjs router doesn't cache it
  return (
    <div className={styles.randomWrapper}>
      <a href="/show/random">Or try a random character</a>
    </div>
  );
}
