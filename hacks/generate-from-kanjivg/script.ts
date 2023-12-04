import * as svgParser from "svg-parser";
import { z } from "zod";
import * as path from "path";
import fs from "fs-extra";
import cheerio from "cheerio";
// Heavily based on https://github.com/Kimtaro/kanjivg2svg/blob/master/kanjivg2svg.rb
const index = require("./kanjivg-r20230312/kvg-index.json");

const svgSchema = z.object({
  width: z.number(),
  height: z.number(),
});

// For each file
// Open it
// Remove the text
// Make it grey
function processFile(filename: string, out: string) {
  const file = fs.readFileSync(filename, "utf8");

  let svgParsed = svgParser.parse(file);

  const svgSchemaParsed = svgSchema.parse(
    (svgParsed.children[0] as any).properties
  );

  // It's parsing wrong because there's XML tags
  //  const $ = cheerio.load(
  //    file,
  //    {
  //      xml: {
  //        xmlMode: false,
  //        recognizeCDATA: true,
  //        recognizeSelfClosing: true,
  //        selfClosingTags: true,
  //        emptyAttrs: true,
  //      },
  //    } as any
  //    //{
  //    //    xmlMode: false,
  //    //   recognizeCDATA: true,
  //    //    decodeEntities: true,
  //    // }
  //  );

  // We need decodeEntities so that the
  // `]>`
  // after ATTLIST isn't escaped to ]&gt;
  const $ = cheerio.load(file, {
    decodeEntities: false,
    xmlMode: true,
    recognizeCDATA: true,
    recognizeSelfClosing: true,
    selfClosingTags: true,
    emptyAttrs: true,
  } as any);

  $("svg text").remove();
  //  const myStyles = "stroke:#ddd;stroke-width:2";
  //const myStyles = "stroke:#999;";
  const myStyles = "stroke:#ddd;";
  const styles = $("svg > g").first().attr("style");
  $("svg > g").first().attr("style", `${styles};${myStyles}`);

  let s = $.html();
  fs.writeFileSync(out, s);
}

const dir = path.join(__dirname, "../../public/kanji-template");

fs.mkdirpSync(dir);

for (let k in index) {
  if (!k) {
    continue;
  }

  const kanjiName = k;
  // Get last item
  const filename = index[k].pop();

  const p = path.join(__dirname, "./kanjivg-r20230312/kanji", filename);
  const out = path.join(dir, kanjiName + ".svg");

  processFile(p, out);
}
