import type { ExampleSentence } from "../models/exampleSentence.schema";
import Link from "next/link";
import styles from "./ExampleSentences.module.css";

export function ExampleSentences(props: { sentences: ExampleSentence[] }) {
  if (props.sentences.length <= 0) {
    return <></>;
  }

  return (
    <details>
      <summary>
        <h4 style={{ display: "inline-block" }}>Example Sentences</h4>
      </summary>
      {props.sentences.map((s) => (
        <div className={styles.exampleSentenceContainer}>
          <ExampleSentenceComp sentence={s} />
        </div>
      ))}
    </details>
  );
}

function ExampleSentenceComp(props: { sentence: ExampleSentence }) {
  const { englishSentence, japaneseSentence } = props.sentence;
  return (
    <>
      <Link href={`/draw/${japaneseSentence}`}>{japaneseSentence}</Link>
      <div>{englishSentence}</div>
    </>
  );
}
