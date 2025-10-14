"use client";
import { getLink } from "@/svc/router";
import { useRouter } from "next/navigation";
import styles from "./Search.module.css";
import MagnifyingClass from "./magnifying_glass.svg";
import Image from "next/image";

export default function Search() {
  const router = useRouter();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      query: HTMLInputElement;
    };

    const link = getLink({
      name: "SHOW",
      query: formElements.query.value,
    });

    router.push(link);
  }

  return (
    <form onSubmit={onSubmit} className={styles.form} data-testid="search-form">
      <input
        className={styles.input}
        type="text"
        required
        data-testid="search-query-input"
        name={"query"}
        placeholder="Input kanji, radical or words"
      />
      <button className={styles.button}>
        <Image src={MagnifyingClass} alt="Search" width="30" height="30" />
      </button>
    </form>
  );
}
