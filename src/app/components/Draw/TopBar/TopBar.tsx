"use client";

import Search from "@/app/components/Search/search";
import styles from "./TopBar.module.css";
import { Logo } from "@/app/components/Logo/Logo";
import { HamburgerMenu } from "@/app/components/HamburgerMenu/HamburgerMenu";
import { useState } from "react";
import Link from "next/link";
import { CloseButton } from "@/app/components/CloseButton/CloseButton";

export function TopBar() {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <nav className={styles.topBar}>
      <div className={`${styles.container}`}>
        <div className={`${styles.wrapper}`}>
          <Logo className={styles.logo} showText />
          <Search buttonColor="DARK" className={styles.search} />

          <button onClick={() => setOpen(!open)}>
            {open ? (
              <CloseButton mode={"dark"} className={styles.menu} />
            ) : (
              <HamburgerMenu mode={"light"} className={styles.menu} />
            )}
          </button>
        </div>
      </div>

      <Sidebar open={open} close={() => setOpen(false)} />
    </nav>
  );
}

const menuItems = [
  { name: "Home", href: "/" },
  { name: "How it Works", href: "/how-it-works" },
  { name: "Disclaimer", href: "/disclaimer" },
];

type SidebarProps = {
  open: boolean;
  close: () => void;
};
function Sidebar({ open, close }: SidebarProps) {
  return (
    <div
      className={`${styles.sidebar} ${open && styles.sidebarOpen}`}
      onClick={() => {
        close();
      }}
    >
      <div className="container">
        <aside
          className={styles.aside}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <nav className={styles.nav}>
            {menuItems.map((item, index) => (
              <Link key={index} href={item.href} className={styles.item}>
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  );
}
