import path from "path";
//import * as sqlite from "sqlite";
import sqlite3 from "better-sqlite3";
import { Kanji, SvgSchema } from "../src/models/kanji.schema";

export async function open(filepath: string | undefined = undefined) {
  const filename = path.join(process.cwd(), "data", "sqlite.db");

  const db = sqlite3(filename, {
    readonly: true,
  });

  //  const db = await sqlite.open({
  //    filename,
  //    driver: sqlite3.Database,
  //  });

  return db;
}

export async function getIdeograms(
  db: sqlite3.Database,
  wordOrPhrase: string
): Promise<{ characters: Kanji[]; fail: any }> {
  // Break into individual characters
  const chars = wordOrPhrase
    .split("")
    // Remove spaces
    .filter((a) => a.trim().length);

  // Only unique
  const uniq = [...new Set(chars)];

  const getIdeogramFn = (ch: string) => getIdeogram(db, ch);
  const p = await Promise.allSettled(uniq.map(getIdeogramFn));

  return {
    characters: p.filter((s) => s.status === "fulfilled").map((s) => s.value),
    fail: p.filter((s) => s.status === "rejected"),
  };
}

export async function getIdeogram(
  db: sqlite3.Database,
  ch: string
): Promise<Kanji> {
  const character = loadCharacterFromDB(db, ch);

  return character;
}

async function loadCharacterFromDB(db: sqlite3.Database, name: string) {
  const prepared = db.prepare(
    `select name, json(json) as body from SVG WHERE name = ?`
  );
  const res = prepared.get(name) as any;
  return {
    name,
    svg: SvgSchema.parse(JSON.parse(res.body)),
  };
}
