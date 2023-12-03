// break each svg from All_svg.json
// into its own file
import allSvg from "../All_svg.json";
import fs from "fs";
import path from "path";

Object.keys(allSvg).forEach((a) => {
  const filename = path.join("public", "kanji", a + ".json");

  console.info(`Writing svg ${filename}`);
  fs.writeFileSync(filename, allSvg[a], {
    // open for writing
    // fails if file exists
    flag: "wx",
  });
});
