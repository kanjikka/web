import { Hero } from "@/app/components/Home/Hero/Hero";
import { HowItWorks } from "@/app/components/Home/HowItWorks/HowItWorks";
import { WaniKani } from "@/app/components/Home/WaniKani/WaniKani";

export default function Home() {
  return (
    <div>
      <main>
        <Hero />
        <HowItWorks />
        <WaniKani />
      </main>
    </div>
  );
}
