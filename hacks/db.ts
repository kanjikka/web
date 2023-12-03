import path from "path";
import * as sqlite from "sqlite";
import sqlite3 from "sqlite3";
import { SvgSchema } from "../src/models/kanji.schema";

// TODO
// pool?
export async function open(filepath: string | undefined = undefined) {
  const filename = filepath ? filepath : path.join(__dirname, "sqlite.db");

  const db = await sqlite.open({
    filename,
    driver: sqlite3.Database,
  });

  return db;
}

export async function migrate(db: sqlite.Database) {
  await db.migrate({
    //    force: true,
    migrationsPath: path.join(__dirname, "migrations"),
  });
}

// finds all kanji
// ie all that found is true
export async function JishoSearchKanji(db: sqlite.Database) {
  const all = await db.all(
    `SELECT name, json(json) as body FROM JishoResult WHERE json_extract(json, '$.found') = true`
  );

  return all.map((a) => {
    return {
      ...a,
      body: JSON.parse(a.body),
    };
  });
}

export async function JishoSearchNonKanji(db: sqlite.Database) {
  const all = await db.all(
    `SELECT name, json(json) as body FROM JishoResult WHERE json_extract(json, '$.found') = false`
  );

  return all.map((a) => {
    return {
      ...a,
      body: JSON.parse(a.body),
    };
  });
}

export async function JishoExists(db: sqlite.Database, name: string) {
  return !!(await db.get("SELECT name FROM JishoResult WHERE name = ?", name));
}

export function JishoRead(db: sqlite.Database, name: string) {
  return db.get(
    "SELECT name, json(body) FROM JishoResult WHERE name = ?",
    name
  );
}
export function JishoInsert(
  db: sqlite.Database,
  args: { name: string; body: any }
) {
  return db.run(
    `INSERT INTO JishoResult (name, json)
          VALUES (?, ?)`,
    args.name,
    JSON.stringify(args.body)
  );
}

export function SVGUpsert(
  db: sqlite.Database,
  args: { name: string; body: any }
) {
  // validate before storing in db
  SvgSchema.parse(args.body);

  return db.run(
    `INSERT or REPLACE INTO SVG (name, json)
          VALUES (?, ?)`,
    args.name,
    JSON.stringify(args.body)
  );
}

export async function findAllNames(db: sqlite.Database) {
  return (await db.all(`SELECT name FROM SVG`)).map((a) => a.name);
}

export async function getAllSvg(db: sqlite.Database) {
  const res = await db.all(`SELECT name, json(svg.json) as svgBody FROM SVG`);
  return res.map((a) => ({
    name: a.name,
    ...SvgSchema.parse(JSON.parse(a.svgBody)),
  }));
}

export async function getCharacter(db: sqlite.Database, name: string) {
  const res = await db.get(
    `select
      svg.name,
      json(JishoResult.json) as jishoBody,
      json(svg.json) as svgBody
    from svg inner join JishoResult on svg.name = JishoResult.name WHERE svg.name = (?)`,
    name
  );

  return {
    name,
    jisho: JSON.parse(res.jishoBody),
    svg: SvgSchema.parse(JSON.parse(res.svgBody)),
  };
}
