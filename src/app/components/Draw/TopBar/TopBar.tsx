"use client";

import Search from "@/app/components/Search/search";
import styles from "./TopBar.module.css";
import { Logo } from "@/app/components/Logo/Logo";
import { HamburgerMenu } from "@/app/components/HamburgerMenu/HamburgerMenu";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CloseButton } from "@/app/components/CloseButton/CloseButton";

type TopBarProps = {
  mode?: "transparent" | "colored";
  className?: string;
  hideSearchbar?: boolean;
};
export function TopBar({
  className = "",
  mode = "colored",
  hideSearchbar,
}: TopBarProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [showLogoText, setShowLogoText] = useState<boolean>(true);

  useEffect(() => {
    function onChange(e) {
      if (!e.matches) {
        setShowLogoText(true);
      } else {
        setShowLogoText(false);
      }
    }

    const mq = window.matchMedia("screen and (max-width: 638px)");
    mq.addEventListener("change", onChange);

    mq.dispatchEvent(new MediaQueryListEvent("change", mq));

    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <nav
      className={`${styles.topBar} ${className} ${
        mode === "transparent" && styles.topBarTransparent
      }`}
    >
      <div className={`${styles.container}`}>
        <div className={`${styles.wrapper}`}>
          <Logo className={styles.logo} showText={showLogoText} />
          {!hideSearchbar && (
            <Search buttonColor="DARK" className={styles.search} />
          )}

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
