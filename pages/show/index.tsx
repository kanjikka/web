import DrawPage from "@/draw/[id]";
import { Kanji } from "@/models/kanji.schema";
import { getAllCharacters } from "@/svc/kanji";
import { redirectToRoot } from "@/svc/router";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type States =
  | { name: "PRISTINE" }
  | { name: "FAILED_ABORT" }
  | { name: "FAILED"; reason: string }
  | {
      name: "LOADED";
      characters: Kanji[];
      query: string;
    };

export default function Page() {
  const router = useRouter();
  const [state, setState] = useState<States>({
    name: "PRISTINE",
  });

  useEffect(() => {
    async function load(query: string) {
      const res = await getAllCharacters(query);

      setState({
        name: "LOADED",
        characters: res.characters,
        query,
      });

      if (res.fail.length) {
        // TODO: figure out how to have info about what character
        console.error("Failed to load some characters:", res.fail);
      }
      //      }
      //        const s = {
      //          name: "FAILED" as const,
      //          reason: `One of the required characters could not be found: ${e}`,
      //        };
      //
      //        setState(s);
      //        alert(s.reason);
      //      }
    }

    if (router.isReady) {
      const q = router.query.c;

      if (!q || Array.isArray(q)) {
        setState({
          name: "FAILED_ABORT",
        });

        redirectToRoot(router);
      } else {
        load(q);
      }
    }
  }, [router.isReady, router.query]);

  if (state.name !== "LOADED") {
    return null;
  }

  return <DrawPage characters={state.characters} query={state.query} />;
}
