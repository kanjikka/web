import fs from "fs";
export { default } from "../src/all";
import path from "path";

export async function getStaticProps(context: any) {
  const index = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "hacks", "results", "final", "index.json"),
      "utf8"
    )
  );

  return {
    props: {
      index,
    },
  };
}
