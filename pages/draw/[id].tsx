import path from "path";
import { KanjiSchema } from "../../src/models/kanji.schema";

export { default } from "../../src/draw/[id]";
import * as datastore from "../../hacks/db";

function isLowerCaseLatin(str) {
  // Check if the string is entirely in lowercase Latin characters
  return /^[a-z]+$/.test(str);
}

//export async function getStaticPaths() {
//  // https://github.com/vercel/next.js/issues/10943
//  const pagesDirectory = path.resolve(process.cwd(), "pages");
//
//  const db = await datastore.open(
//    path.join(pagesDirectory, "../", "hacks", "sqlite.db")
//  );
//
//  // Skip '.' since otherwise it will be normalized to empty string
//  // Which generates a route conflict
//  // Error: Requested and resolved page mismatch: /draw/. /draw
//  // Also since mac filesystem doesn't distinguish between lowercase and uppercase, remove lowercase ones
//  const names = (await datastore.findAllNames(db))
//    .filter((a) => a != ":" && a != ".")
//    .filter((a) => !isLowerCaseLatin(a));
//
//  const paths = names.map((a) => ({ params: { id: a } }));
//
//  return {
//    paths,
//    fallback: false,
//  };
//}
//
//// TODO type
//export async function getStaticProps(context: any) {
//  // https://github.com/vercel/next.js/issues/10943
//  const pagesDirectory = path.resolve(process.cwd(), "pages");
//  const db = await datastore.open(
//    path.join(pagesDirectory, "../", "hacks", "sqlite.db")
//  );
//
//  const res = await datastore.getCharacter(db, context.params.id);
//
//  //const jsonParsed = JSON.parse(file);
//  const kanji = KanjiSchema.parse(res);
//
//  return {
//    props: {
//      kanji,
//    },
//  };
//}
export async function getServerSideProps(context: any) {
  // https://github.com/vercel/next.js/issues/10943
  const pagesDirectory = path.resolve(process.cwd(), "pages");
  const db = await datastore.open(
    path.join(pagesDirectory, "../", "hacks", "sqlite.db")
  );

  // Break into individual characters
  const chars = context.params.id.split("");

  const requests = chars.map(async (a) => {
    const res = await datastore.getCharacter(db, a);
    return KanjiSchema.parse(res);
  });

  const kanjis = await Promise.all(requests);

  return {
    props: {
      kanjis,
    },
  };
}
