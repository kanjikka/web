import DrawPage from "@/app/components/Draw/[id]";
import { getRandomIdeogram } from "@/svc/ideogram";

export default async function Page() {
  const ideogram = await getRandomIdeogram();

  return <DrawPage characters={[ideogram]} query={ideogram.name} />;
}
