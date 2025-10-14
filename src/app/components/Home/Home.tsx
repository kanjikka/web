import styles from "./Home.module.css";
import Search from "@/app/components/Search/search";
import HeroImage from "./Hero.jpg";
import Image from "next/image";
import { Recoleta } from "@/app/fonts/Fonts";

function Nav() {
  return <nav></nav>;
}

function Hero() {
  return (
    <div className={styles.hero}>
      <Image src={HeroImage} alt="" fill className={styles.heroImage} />
      <h1 className={`${Recoleta.className} ${styles.heroTitle}`}>
        Lookup kanji stroke order
      </h1>
      <div>
        <Search />
      </div>
    </div>
  );
}
export default function Home() {
  return (
    <div className="container">
      <Nav />
      <main className={styles.main}>
        <Hero />
      </main>
    </div>
  );
}
