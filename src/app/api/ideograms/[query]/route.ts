import { getIdeograms, open } from "@/../data/db";
import { NextRequest } from "next/server";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ query: string }> }
) {
  const { query } = await params;
  const dbPath = path.join(process.cwd(), "hacks", "sqlite.db");
  const db = await open(dbPath);
  const ch = await getIdeograms(db, query);

  return Response.json({ ...ch });
}
