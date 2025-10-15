import Image from "next/image";
import HamburgerMenuIcon from "./HamburgerMenu.svg";

type Props = {
  className?: string;
};
export function HamburgerMenu({ className = "" }: Props) {
  return (
    <Image
      className={className}
      src={HamburgerMenuIcon}
      alt="Menu"
      width="40"
      height="40"
    />
  );
}
