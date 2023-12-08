// Example Sentences
// Let's populate the database
// Using the `all_v11.json` file we got from https://sentencesearch.neocities.org/data/all_v11.json

import { Database } from "sqlite";
import * as datastore from "../db";
import data from "./all_v11.json";

async function run() {
  // open the database
  const db = await datastore.open();
  await datastore.migrate(db);

  for (let i = 0; i < data.length; i++) {
    datastore.insertExampleSentence(db, {
      source: data[i].source,
      audioJapanese: data[i].audio_jap,
      japaneseSentence: data[i].jap,
      englishSentence: data[i].eng,
    });
  }
}

if (require.main == module) {
  run();
}
