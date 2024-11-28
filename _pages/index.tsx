export { default } from "../src/index";
import * as datastore from "../hacks/db";
import path from "path";

// Load all SVG names
export async function getStaticProps() {
  // https://github.com/vercel/next.js/issues/10943
  const pagesDirectory = path.resolve(process.cwd(), "pages");
  const db = await datastore.open(
    path.join(pagesDirectory, "../", "hacks", "sqlite.db")
  );

  const res = await datastore.findAllNames(db);

  return {
    props: {
      names: res,
    },
  };
}
