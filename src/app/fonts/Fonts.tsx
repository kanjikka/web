import localFont from "next/font/local";
import { Inter as InterFont } from "next/font/google";

export const Recoleta = localFont({
  src: "./Recoleta-RegularDEMO.otf",
});

export const Inter = InterFont({ subsets: ["latin"] });
