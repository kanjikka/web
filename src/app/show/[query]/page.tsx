import DrawPage from "@/draw/[id]";
import { getIdeograms } from "@/svc/ideogram";

export default async function Page({
  params,
}: {
  params: Promise<{ query: string }>;
}) {
  const { query } = await params;
  const ideograms = await getIdeograms(query);

  return <DrawPage characters={ideograms.characters} query={query} />;
}
