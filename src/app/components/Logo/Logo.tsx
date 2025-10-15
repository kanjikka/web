import Image from "next/image";
import LogoImage from "./Logo.svg";
import Link from "next/link";

type LogoProps = {
  showText?: boolean;
};

export function Logo({ showText = false }: LogoProps) {
  return (
    <span>
      <Link href="/">
        <Image src={LogoImage} width="40" height="80" alt="Kanjikka Logo" />
        {showText && "Kanjikka"}
      </Link>
    </span>
  );
}
