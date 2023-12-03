import JishoAPI from "unofficial-jisho-api";
const jisho = new JishoAPI();
import * as svgParser from "svg-parser";

import path from "path";
import fs from "fs-extra";
import { z } from "zod";
import { performance } from "perf_hooks";
import cheerio from "cheerio";
import * as datastore from "./db";

import { Database } from "sqlite";

// Load list of all kanjis
// One by one:
// if stored in cache, skip
// else hit from jisho
//   if ok, store in results/$kanji.json + svg
//   else, store in results/failures/$kanji.json
//
import allKanji from "../public/all-kanji.json";

// comes from
// https://github.com/rouleaup88/Kanji-stroke-order
import allSvg from "../All_svg.json";

const RESULTS_DIR = "results";

function debug(...args: any) {
  console.error(...args);
}

// https://stackoverflow.com/a/20487371
function toASCII(chars: string) {
  var ascii = "";
  for (var i = 0, l = chars.length; i < l; i++) {
    var c = chars[i].charCodeAt(0);

    // make sure we only convert half-full width char
    if (c >= 0xff00 && c <= 0xffef) {
      c = 0xff & (c + 0x20);
    }

    ascii += String.fromCharCode(c);
  }

  return ascii;
}

async function download(db: Database) {
  let failures = [];
  const concurrent = 5;

  for (let i = 0; i < allKanji.length / concurrent; i++) {
    let promises = [];

    for (let j = 0; j < concurrent; j++) {
      const kanji = toASCII(allKanji[i * concurrent + j].trim());

      // file already exists, skipping it
      if (datastore.JishoExists(db, kanji)) {
        debug(`${kanji} already been downloaded from jisho. skipping.`);
      } else {
        debug(`${kanji} was not found in JishoResult database. downloading.`);
        promises.push(jisho.searchForKanji(allKanji[i * concurrent + j]));
      }
    }

    const result = await Promise.allSettled(promises);

    // store failures
    const f = result
      .filter((s) => s.status == "rejected")
      .map((s) => ({ s, reason: "promise rejected" }));
    failures.push(...f);

    // write the results to database
    result
      .filter((s) => s.status == "fulfilled")
      .forEach(async (s) => {
        const cleaned = (s as any).value;
        cleaned.query = toASCII(cleaned.query);

        await datastore.JishoInsert(db, {
          name: cleaned.query,
          body: cleaned,
        });
      });
  }
}

function kanjiFilename(k: string) {
  return path.join(__dirname, RESULTS_DIR, "jisho", k + ".json");
}

// TODO
// filter:
// - non japanese characters
// - characters bigger than 1
// Bare minimum
const kanjiFromJishoSchema = z.object({
  query: z.string(),
  found: z.literal(true), // don't care if it's false
  strokeCount: z.number(),
  meaning: z.string(),
  strokeOrderDiagramUri: z.string(),
  strokeOrderSvgUri: z.string(),
  strokeOrderGifUri: z.string(),
  parts: z.array(z.string()),
});

// hiragana or latin characters
const nonKanji = z.object({
  found: z.literal(false),
});

const fromJishoSchema = kanjiFromJishoSchema.or(nonKanji);

const svgSchema = z.object({
  width: z
    .string()
    .refine((v) => `${parseInt(v, 10)}px` === v)
    .transform((v) => parseInt(v, 10)),
  height: z
    .string()
    .refine((v) => `${parseInt(v, 10)}px` === v)
    .transform((v) => parseInt(v, 10)),
});

// bare minimum data
const outputSchema = z.object({
  name: z.string(),
  svg: z.object({
    // TODO
    individualWidth: z.number().default(109),
    templateFilename: z.string(),
    strokeOrderFilename: z.string(),

    width: z.number(),
    height: z.number(),
  }),
});

async function p(k: string, failures: any[]) {
  // load the file
  const filename = kanjiFilename(k);
  let file;

  try {
    file = JSON.parse(fs.readFileSync(filename, "utf8"));
  } catch (e) {
    failures.push({ e: e, name: k, reason: "failed to load object from fs" });
    return;
  }

  // type check the result
  // (validating it's a valid response, ie found = true)
  const v = fromJishoSchema.safeParse(file);
  if (!v.success) {
    failures.push({
      e: JSON.stringify(v),
      name: k,
      reason: "failed to parse object",
    });
    return;
  }

  const svgRes = await processSVG(k);
  if (svgRes.type === "failure") {
    failures.push({
      ...svgRes.data,
    });
    return;
  }

  const res = {
    ...v.data,
    name: k,
    //    name: v.data.query,
    svg: svgRes.data,
  };

  const parsed = outputSchema.safeParse(res);
  if (!parsed.success) {
    failures.push({
      e: JSON.stringify(parsed),
      name: k,
      reason: "failed to parse output object with zod",
    });
    return;
  }

  return parsed.data;
}

async function processSVG(kanjiName: string) {
  // In a nutshell:
  // Load SVG
  // Parse to check if all required fields are there
  // Write that kanji to the public folder
  // Generate a template version (without circle and all strokes gray)
  // load the svg from All_svg.json

  const svg = allSvg[kanjiName];
  if (!svg) {
    throw new Error("svg not present" + kanjiName);
  }

  let svgParsed = svgParser.parse(svg);

  const svgSchemaParsed = svgSchema.safeParse(
    (svgParsed.children[0] as any).properties
  );
  if (!svgSchemaParsed.success) {
    return {
      type: "failure",
      data: {
        e: JSON.stringify(svgSchemaParsed),
        name: kanjiName,
        reason: "failed to parse svg object with zod",
      },
    };
  }

  // Generate a template version
  const $ = cheerio.load(svg);

  // Remove the red circle that indicate stroke direction
  if ($("svg circle").length === 0) {
    return {
      type: "failure",
      data: {
        name: kanjiName,
        reason: "there are no circles within the svg",
      },
    };
  }

  $("svg circle").remove();

  $("svg path").each((i, el: cheerio.TagElement) => {
    if (!/stroke:.*;/.test(el.attribs.style)) {
      // Fail fast
      return {
        type: "failure",
        data: {
          name: kanjiName,
          reason: "svg path does not have a stroke style",
        },
      };
    }

    // replace the black for grey
    $(el).attr("style", el.attribs.style.replace(/stroke:.*;/, "stroke:#999;"));
  });

  // Write the svg
  await fs.writeFile(
    path.join(__dirname, "../", "public", "svg", kanjiName + ".svg"),
    svg,
    { flag: "w" }
  );

  $("svg").parent().html();
  await fs.writeFile(
    path.join(
      __dirname,
      "../",
      "public",
      "svg",
      kanjiName + ".template" + ".svg"
    ),
    $("svg").parent().html()
  );

  return {
    templateFilename: path.join("/", "svg", kanjiName + ".template" + ".svg"),
    strokeOrderFilename: path.join("/", "svg", kanjiName + ".svg"),

    width: svgSchemaParsed.data.width,
    height: svgSchemaParsed.data.height,
  };
}

async function processKanji(db: Database) {
  // load all kanji from jisho
  // TODO pass zod between boundaries
  const kanjis = await datastore.JishoSearchKanji(db);

  for (let kanji of kanjis) {
    // process svg
    const svgRes = await processSVG(kanji.name);

    // insert into svg table
    await datastore.SVGUpsert(db, { name: kanji.name, body: svgRes });
  }
}

async function processNonKanji(db: Database) {
  // load all kanji from jisho
  // TODO pass zod between boundaries
  const chars = await datastore.JishoSearchNonKanji(db);

  for (let c of chars) {
    // process svg
    const svgRes = await processSVG(c.name);

    // insert into svg table
    await datastore.SVGUpsert(db, { name: c.name, body: svgRes });
  }
}

async function mirrorSVGTableToFs(db: Database) {
  // we need to mirror the svg table into the file system
  // so that custom pages can be generated
  // /custom
  // write the svg.json
  const svgs = await datastore.getAllSvg(db);

  for (let svg of svgs) {
    await fs.writeFile(
      path.join(__dirname, "../", "public", "svg", svg.name + ".json"),
      JSON.stringify(svg),
      { flag: "w" }
    );
  }
}

async function run() {
  // open the database
  const db = await datastore.open();
  await datastore.migrate(db);

  // download from Jisho
  await download(db);

  // process all kanji
  await processKanji(db);

  // process all non kanji
  await processNonKanji(db);

  // load svg table into individual svg.json files
  // this is necessary so that we can create canvas dynamically
  // on the client side
  await mirrorSVGTableToFs(db);
}

if (require.main == module) {
  run();
}

export const KanjiSchema = outputSchema;
