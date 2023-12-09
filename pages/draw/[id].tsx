import path from "path";
import { Kanji, KanjiSchema } from "../../src/models/kanji.schema";

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
  const chars = context.params.id.split("").filter((a) => a.trim().length);

  const requests = chars.map(async (a) => {
    try {
      const res = await datastore.getCharacter(db, a);
      return KanjiSchema.parse(res);
    } catch (e) {
      console.error("error", e);
      // TODO: this messes up type inference ;/
      return Promise.resolve(undefined);
    }
  });

  // Filter out the ones that failed
  const kanjis: Kanji[] = (await Promise.all(requests)).filter((a) => !!a);

  // Redirect to the "canonical version", for example ~FOO would be redirect to FOO
  if (kanjis.length != chars.length) {
    const destination =
      `/draw/` + encodeURIComponent(`${kanjis.map((a) => a.name).join()}`);

    return {
      redirect: {
        permanent: false,
        destination,
      },
    };
  }

  if (kanjis.length <= 0) {
    throw new Error("No character available.");
  }

  // TODO: do this concurrently?
  let exampleSentences = await datastore.searchExampleSentence(
    db,
    chars.join("")
  );

  let sentence: typeof exampleSentences[number] = null;

  // There's only one sentence, itself
  // So there's no need to show itself as an "example sentence"
  if (
    exampleSentences.length === 1 &&
    exampleSentences[0].japaneseSentence === chars.join("")
  ) {
    sentence = exampleSentences[0];
    exampleSentences = [];
  }

  return {
    props: {
      sentence,
      exampleSentences,
      kanjis,
    },
  };
}
