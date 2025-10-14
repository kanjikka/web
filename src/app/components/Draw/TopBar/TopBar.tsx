import Search from "@/app/components/Search/search";
import styles from "./TopBar.module.css";

export function TopBar() {
  return (
    <nav className={styles.topBar}>
      <div>
        <Search buttonColor="DARK" />
      </div>
    </nav>
  );
}
