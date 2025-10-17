import DrawPage from "@/app/components/Draw/[id]";
import { getRandomIdeogram } from "@/svc/ideogram";

export default async function Page() {
  const ideogram = await getRandomIdeogram();

  return <DrawPage characters={[ideogram]} query={ideogram.name} />;
}

// Opt out from static site generation
// Since we want to generate a different page every time
export const dynamic = "force-dynamic";
