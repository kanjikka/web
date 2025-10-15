import Image from "next/image";
import LogoImage from "./Logo.svg";
import Link from "next/link";
import { Recoleta } from "@/app/fonts/Fonts";
import styles from "./Logo.module.css";

type LogoProps = {
  showText?: boolean;
  className?: string;
};

export function Logo({ showText = false, className = "" }: LogoProps) {
  return (
    <Link href="/" className={`${styles.anchor} ${className}`}>
      <Image src={LogoImage} width="40" height="80" alt="Kanjikka Logo" />
      {showText && (
        <span className={`${Recoleta.className} ${styles.title}`}>
          Kanjikka
        </span>
      )}
    </Link>
  );
}
