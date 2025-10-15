import Search from "@/app/components/Search/search";
import styles from "./TopBar.module.css";
import { Logo } from "@/app/components/Logo/Logo";
import { HamburgerMenu } from "@/app/components/HamburgerMenu/HamburgerMenu";

export function TopBar() {
  return (
    <nav className={styles.topBar}>
      <div className={`${styles.container} container`}>
        <div className={`${styles.wrapper}`}>
          <Logo className={styles.logo} showText />
          <Search buttonColor="DARK" />

          <HamburgerMenu className={styles.menu} />
        </div>
      </div>
    </nav>
  );
}
