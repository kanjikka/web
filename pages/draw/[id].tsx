import path from "path";
import { KanjiSchema } from "../../src/models/kanji.schema";

export { default } from "../../src/draw/[id]";
import * as datastore from "../../hacks/db";

export async function getStaticPaths() {
  // https://github.com/vercel/next.js/issues/10943
  const pagesDirectory = path.resolve(process.cwd(), "pages");

  const db = await datastore.open(
    path.join(pagesDirectory, "../", "hacks", "sqlite.db")
  );

  const names = await datastore.findAllNames(db);
  const paths = names.map((a) => ({ params: { id: a } }));

  return {
    paths,
    fallback: false,
  };
}

// TODO type
export async function getStaticProps(context: any) {
  // https://github.com/vercel/next.js/issues/10943
  const pagesDirectory = path.resolve(process.cwd(), "pages");
  const db = await datastore.open(
    path.join(pagesDirectory, "../", "hacks", "sqlite.db")
  );

  const res = await datastore.getCharacter(db, context.params.id);

  //const jsonParsed = JSON.parse(file);
  const kanji = KanjiSchema.parse(res);

  return {
    props: {
      kanji,
    },
  };
}
