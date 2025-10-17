import { TopBar } from "@/app/components/Draw/TopBar/TopBar";
import { Recoleta } from "@/app/fonts/Fonts";
import styles from "./HowItWorks.module.css";
import WomanImg from "./woman.svg";
import Link from "next/link";
import Image from "next/image";

export function HowItWorks() {
  return (
    <section>
      <TopBar />
      <main className={`container ${styles.main}`}>
        <h1 className={`${Recoleta.className} ${styles.title}`}>
          How It Works
        </h1>

        <div className={styles.block}>
          <h2 className={`${Recoleta.className} ${styles.heading2}`}>
            The Method
          </h2>

          <div className={styles.block}>
            <h3 className={`${Recoleta.className} ${styles.heading3}`}>
              How to approach it?
            </h3>
            <p>
              We recommend pairing up with a Kanji/Vocabulary learning tool.
              Could be WaniKani, Anki, Graded Readings etc.
            </p>
            <p>
              The point is that after you meet a new kanji or word.{" "}
              <b>Search it up here and practice writing it down a few times.</b>
            </p>
            <p>
              We recommend for Kanji, to write it down at least 10 times. And
              for words based on kanji you already know, to write it down 4 or
              so times.
            </p>

            <p>
              <b>Pay attention to the radicals, and of course, stroke order.</b>
            </p>
          </div>

          <h3 className={`${Recoleta.className} ${styles.heading3}`}>
            The Science
          </h3>
          <p>
            There are several studies that support the idea that handwriting
            helps memory/recognition/learning, specially in writing systems such
            as Chinese and Japanese:
          </p>
          <ul>
            <li>
              <Link href="https://pubmed.ncbi.nlm.nih.gov/9701971/">
                Repeated writing facilitates children's memory for
                pseudocharacters and foreign letters
              </Link>
            </li>

            <li>
              <Link href="https://pubmed.ncbi.nlm.nih.gov/17011660/">
                Remembering the orientation of newly learned characters depends
                on the associated writing knowledge: a comparison between
                handwriting and typing
              </Link>
            </li>

            <li>
              <Link href="https://pubmed.ncbi.nlm.nih.gov/17011660/">
                The Effects of Handwriting Experience on Literacy Learning
              </Link>
            </li>
          </ul>

          <div className={styles.block}>
            <h3 className={`${Recoleta.className} ${styles.heading3}`}>
              Is it worth my time?
            </h3>
            <p>
              One common criticism is that writing every single kanji a few
              times takes a lot of time. Which is a fair point. We will not try
              to convince you.
            </p>
          </div>
        </div>

        <div className={styles.block}>
          <h2 className={`${Recoleta.className} ${styles.heading2}`}>
            Why should I use this website?
          </h2>
          <p>
            There are other websites that have similar functionality:
            <ul>
              <li>
                <Link href="https://kanji.sljfaq.org/kanjivg.html">
                  https://kanji.sljfaq.org/kanjivg.html
                </Link>
              </li>
              <li>
                <Link href="https://kanji.sljfaq.org/kanjivg.html">
                  https://www.kakimashou.com/dictionary/word/%E6%97%A5%E6%9C%AC
                </Link>
              </li>
            </ul>
          </p>
          <p>
            <span className={Recoleta.className}>
              <b>Kanjikka</b>
            </span>
            , however, works with multiple kanjis.
          </p>
        </div>

        <div className={styles.illustrationWrapper}>
          <Image
            src={WomanImg}
            alt="Woman pointing to a blackboard"
            width="389"
            height="291"
          />
        </div>
      </main>
    </section>
  );
}
