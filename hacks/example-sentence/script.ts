// Example Sentences
// Let's populate the database
// Using the `all_v11.json` file we got from https://sentencesearch.neocities.org/data/all_v11.json

import { existsSync } from "fs";
import { Database } from "sqlite";
import * as datastore from "../db";
import data from "./all_v11.json";
import * as path from "path";

async function run() {
  // open the database
  const db = await datastore.open();
  await datastore.migrate(db);

  // TODO: skip those that don't have all items
  for (let i = 0; i < data.length; i++) {
    if (audioFileExists(data[i].audio_jap)) {
      datastore.insertExampleSentence(db, {
        source: data[i].source,
        audioJapanese: data[i].audio_jap,
        japaneseSentence: data[i].jap,
        englishSentence: data[i].eng,
      });
    }
  }
}

// My understanding is that all files from tango/n3 don't exist :\
function audioFileExists(src) {
  return existsSync(path.join(__dirname, "../../public/audio-files", src));
}
//
if (require.main == module) {
  run();
}
