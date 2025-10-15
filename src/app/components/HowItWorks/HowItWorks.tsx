import Image from "next/image";
import Img1 from "./img1.svg";
import Img2 from "./img2.svg";
import Img3 from "./img3.svg";
import styles from "./HowItWorks.module.css";
import { Recoleta } from "@/app/fonts/Fonts";
import Link from "next/link";

const Items = [
  {
    title: "1. Search",
    body: (
      <>
        Using our website, search for any kanji, radical, ou word stroke order."
      </>
    ),
    imgWrapperClassname: styles.img1,
    img: Img1,
  },
  {
    title: "2. Practice",
    body: <>Write in down in a piece of paper a few times.</>,
    img: Img2,
    imgWrapperClassname: styles.img2,
  },
  {
    title: "3. Remember",
    body: (
      <>
        Next time you see that word/kanji, try writing it down from memory.{" "}
        <br /> It will stick in your mind."
      </>
    ),
    img: Img3,
    imgWrapperClassname: styles.img3,
  },
];
export function HowItWorks() {
  return (
    <section className={`${styles.section} container`}>
      <h2 className={`${Recoleta.className} ${styles.sectionTitle}`}>
        How it works
      </h2>

      <div className={styles.wrapper}>
        {Items.map((i) => {
          return (
            <div key={i.title} className={styles.itemWrapper}>
              <div className={i.imgWrapperClassname}>
                <Image src={i.img} width="105" height="205" alt={i.title} />
              </div>

              <h3 className={`${Recoleta.className} ${styles.title}`}>
                {i.title}
              </h3>
              <p className={styles.text}>{i.body}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
