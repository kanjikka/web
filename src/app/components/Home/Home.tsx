import styles from "./Home.module.css";
import { Hero } from "@/app/components/Home/Hero/Hero";

function Nav() {
  return <nav></nav>;
}

export default function Home() {
  return (
    <div>
      <Nav />
      <main className={styles.main}>
        <Hero />
      </main>
    </div>
  );
}
