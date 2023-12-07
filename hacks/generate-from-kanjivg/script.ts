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

  // Add the guides
  // A horizontal line
  $("svg").append(
    `
   <line xmlns="http://www.w3.org/2000/svg" x1="0" y1="${
     svgSchemaParsed.height / 2
   }" x2="${svgSchemaParsed.width}" y2="${
      svgSchemaParsed.height / 2
    }" style="stroke:#ddd;stroke-width:2;stroke-dasharray:3 3"/>
   `
  );

  // A vertical line
  $("svg").append(
    `
   <line xmlns="http://www.w3.org/2000/svg" x1="${
     svgSchemaParsed.width / 2
   }" y1="0" x2="${svgSchemaParsed.width / 2}" y2="${
      svgSchemaParsed.height
    }" style="stroke:#ddd;stroke-width:2;stroke-dasharray:3 3"/>
   `
  );

  const w = svgSchemaParsed.width;
  const h = svgSchemaParsed.height;

  // Box around it
  // We use stroke-width, which will then collapse and become 2 when rendering!
  $("svg").append(
    `<line xmlns="http://www.w3.org/2000/svg"
    x1="0"
    y1="0"
    x2="0"
    y2="${h}"
    style="stroke:#ddd;stroke-width:1;"/>`
  );

  $("svg").append(
    `<line xmlns="http://www.w3.org/2000/svg"
    x1="${w}"
    y1="0"
    x2="${w}"
    y2="${h}"
    style="stroke:#ddd;stroke-width:1;"/>`
  );

  $("svg").append(
    `<line xmlns="http://www.w3.org/2000/svg"
    x1="0"
    y1="0"
    x2="${w}"
    y2="0"
    style="stroke:#ddd;stroke-width:1;"/>`
  );

  $("svg").append(
    `<line xmlns="http://www.w3.org/2000/svg"
    x1="0"
    y1="${h}"
    x2="${w}"
    y2="${h}"
    style="stroke:#ddd;stroke-width:1;"/>`
  );

  const myStyles = "stroke:#ddd;";
  const styles = $("svg > g").first().attr("style");
  $("svg > g").first().attr("style", `${styles};${myStyles}`);

  let s = $.html();
  fs.writeFileSync(out, s);
}

function createTemplate(filename: string, out: string) {
  const file = fs.readFileSync(filename, "utf8");

  let svgParsed = svgParser.parse(file);

  const svgSchemaParsed = svgSchema.parse(
    (svgParsed.children[0] as any).properties
  );

  const $ = cheerio.load(file, {
    decodeEntities: false,
    xmlMode: true,
    recognizeCDATA: true,
    recognizeSelfClosing: true,
    selfClosingTags: true,
    emptyAttrs: true,
  } as any);

  $("svg>*").remove();

  // Add the guides
  // A horizontal line
  $("svg").append(
    `
   <line xmlns="http://www.w3.org/2000/svg" x1="0" y1="${
     svgSchemaParsed.height / 2
   }" x2="${svgSchemaParsed.width}" y2="${
      svgSchemaParsed.height / 2
    }" style="stroke:#ddd;stroke-width:2;stroke-dasharray:3 3"/>
   `
  );

  // A vertical line
  $("svg").append(
    `
   <line xmlns="http://www.w3.org/2000/svg" x1="${
     svgSchemaParsed.width / 2
   }" y1="0" x2="${svgSchemaParsed.width / 2}" y2="${
      svgSchemaParsed.height
    }" style="stroke:#ddd;stroke-width:2;stroke-dasharray:3 3"/>
   `
  );

  const w = svgSchemaParsed.width;
  const h = svgSchemaParsed.height;

  // Box around it
  // We use stroke-width, which will then collapse and become 2 when rendering!
  $("svg").append(
    `<line xmlns="http://www.w3.org/2000/svg"
    x1="0"
    y1="0"
    x2="0"
    y2="${h}"
    style="stroke:#ddd;stroke-width:1;"/>`
  );

  $("svg").append(
    `<line xmlns="http://www.w3.org/2000/svg"
    x1="${w}"
    y1="0"
    x2="${w}"
    y2="${h}"
    style="stroke:#ddd;stroke-width:1;"/>`
  );

  $("svg").append(
    `<line xmlns="http://www.w3.org/2000/svg"
    x1="0"
    y1="0"
    x2="${w}"
    y2="0"
    style="stroke:#ddd;stroke-width:1;"/>`
  );

  $("svg").append(
    `<line xmlns="http://www.w3.org/2000/svg"
    x1="0"
    y1="${h}"
    x2="${w}"
    y2="${h}"
    style="stroke:#ddd;stroke-width:1;"/>`
  );

  const myStyles = "stroke:#ddd;";
  const styles = $("svg > g").first().attr("style");
  $("svg > g").first().attr("style", `${styles};${myStyles}`);

  let s = $.html();
  fs.writeFileSync(out, s);
}

//processFile(
//  __dirname + "/kanjivg-r20230312/kanji/0003f.svg",
//  "/Users/eduardo/tmp/test.svg"
//);
//
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

createTemplate(
  path.join(__dirname, "./kanjivg-r20230312/kanji/00021.svg"),
  path.join(dir, "template.svg")
);
