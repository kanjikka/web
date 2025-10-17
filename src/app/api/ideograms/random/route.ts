import { getRandomIdeogram, open } from "@/../data/db";
import { NextRequest } from "next/server";
import path from "path";

export async function GET(req: NextRequest) {
  const dbPath = path.join(process.cwd(), "hacks", "sqlite.db");
  const db = await open(dbPath);
  const ch = await getRandomIdeogram(db);

  return Response.json({ ...ch });
}
