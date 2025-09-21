"use client";

import DrawPage from "@/draw/[id]";
import { Kanji } from "@/models/kanji.schema";
import { getAllCharacters } from "@/svc/kanji";
import { useSearchParams } from "next/navigation";
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
  const [state, setState] = useState<States>({
    name: "PRISTINE",
  });

  return <h1>Hello world</h1>;

  /*
  const searchParams = useSearchParams();
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

    if (searchParams) {
      const q = searchParams.get("c");

      if (!q || Array.isArray(q)) {
        setState({
          name: "FAILED_ABORT",
        });

        //        redirectToRoot(router);
      } else {
        load(q);
      }
    }
  }, [searchParams]);

  if (state.name !== "LOADED") {
    return null;
  }

  return <DrawPage characters={state.characters} query={state.query} />;
   */
}
