"use client";
import { getLink } from "@/svc/router";
import { useRouter } from "next/navigation";
import styles from "./Search.module.css";
import { useRef, useState } from "react";

type SearchProps = {
  buttonColor?: "NORMAL" | "DARK";
};

export default function Search({ buttonColor = "NORMAL" }: SearchProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || !buttonRef.current) {
      return;
    }

    const form = event.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      query: HTMLInputElement;
    };
    const link = getLink({
      name: "SHOW",
      query: formElements.query.value,
    });

    function onAnimate() {
      // Wait a little bit after the transition ends to move to the next
      setTimeout(() => {
        router.push(link);
      }, 100);
    }

    buttonRef.current.removeEventListener("transitionend", onAnimate);
    setLoading(true);

    buttonRef.current.addEventListener("transitionend", onAnimate);
  }

  const Icon = loading ? <LoadingIcon /> : <MagnifyingGlassIcon />;

  return (
    <div className={styles.form}>
      <form onSubmit={onSubmit} data-testid="search-form">
        <input
          className={styles.input}
          type="text"
          required
          data-testid="search-query-input"
          name={"query"}
          placeholder="Input kanji, radical or words (in japanese)"
        />
        <button
          ref={buttonRef}
          className={`${styles.button} ${
            buttonColor === "DARK" && styles.darkButton
          } ${loading && styles.buttonLoading}`}
        >
          {Icon}
        </button>
      </form>
    </div>
  );
}

function MagnifyingGlassIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32.3807 34.6936L21.9726 24.2855C21.1465 24.9463 20.1966 25.4695 19.1227 25.855C18.0488 26.2404 16.9062 26.4332 15.6946 26.4332C12.6933 26.4332 10.1535 25.3935 8.0752 23.314C5.99687 21.2346 4.95716 18.6948 4.95606 15.6946C4.95495 12.6944 5.99467 10.1546 8.0752 8.0752C10.1557 5.99577 12.6955 4.95605 15.6946 4.95605C18.6937 4.95605 21.2341 5.99577 23.3157 8.0752C25.3973 10.1546 26.4365 12.6944 26.4332 15.6946C26.4332 16.9062 26.2404 18.0488 25.855 19.1227C25.4695 20.1966 24.9463 21.1465 24.2855 21.9726L34.6936 32.3807L32.3807 34.6936ZM15.6946 23.129C17.7597 23.129 19.5153 22.4065 20.9615 20.9615C22.4076 19.5164 23.1301 17.7608 23.129 15.6946C23.1279 13.6284 22.4054 11.8733 20.9615 10.4294C19.5176 8.9855 17.7619 8.26243 15.6946 8.26023C13.6273 8.25803 11.8722 8.98109 10.4294 10.4294C8.9866 11.8777 8.26353 13.6328 8.26023 15.6946C8.25693 17.7564 8.97999 19.512 10.4294 20.9615C11.8789 22.4109 13.6339 23.1334 15.6946 23.129Z"
        fill="white"
      />
    </svg>
  );
}

function LoadingIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={styles.loadingIcon}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeDasharray="16"
        strokeDashoffset="16"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 3c4.97 0 9 4.03 9 9"
      >
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          dur="0.2s"
          values="16;0"
        />
        <animateTransform
          attributeName="transform"
          dur="1.5s"
          repeatCount="indefinite"
          type="rotate"
          values="0 12 12;360 12 12"
        />
      </path>
    </svg>
  );
}
