import { useRouter } from "next/router";
import path from "path";
import { useEffect, useState } from "react";
import DrawComponent from "../../src/draw/custom";
import { Svg, SvgSchema } from "../../src/models/kanji.schema";
import datastore from "../../hacks/db";

export function Custom(props: { query: string }) {
  const [svg, setSvg] = useState<Svg & { name: string }[]>();

  console.log("obj", props.query);

  useEffect(() => {
    if (Array.isArray(props.query) || !props.query) {
      return;
      //      throw new Error("bad url" + id);
      // TODO maybe 404?
    }

    console.log("query is", props.query);
    const chars = props.query.split("");

    (function () {
      // TODO load all available names?
      // TODO try catch
      // TODO figure out exactly which one is failing
      Promise.all(
        chars.map((a) =>
          fetch(`/svg/${a}.json`)
            .then((res) => res.json())
            .then((res) => SvgSchema.parse(res))
            .then((res) => ({ ...res, name: a }))
        )
      )
        .then((kanjis) => {
          setSvg(kanjis);
        })
        .catch((e) => {
          // TODO do something
          throw new Error("failed to load. sorry" + e);
        });
    })();
  }, [props.query]);

  // fetch
  if (svg) {
    return <DrawComponent available={[]} svg={svg} />;
  } else {
    return <div>still loading</div>;
  }
}

export default function Component() {
  const router = useRouter();
  const { id } = router.query;
  const [svg, setSvg] = useState<Svg & { name: string }[]>();

  useEffect(() => {
    if (Array.isArray(id) || !id) {
      return;
      //      throw new Error("bad url" + id);
      // TODO maybe 404?
    }

    const chars = id.split("");
    (function () {
      // TODO load all available names?
      // TODO try catch
      Promise.all(
        chars.map((a) =>
          fetch(`/svg/${a}.json`)
            .then((res) => res.json())
            .then((res) => SvgSchema.parse(res))
            .then((res) => ({ ...res, name: a }))
        )
      )
        .then((kanjis) => {
          setSvg(kanjis);
        })
        .catch(() => {
          // TODO do something
          throw new Error("failed to load. sorry");
        });
    })();
  }, [router.query]);
  // TODO something more robust

  // fetch
  if (svg) {
    return <DrawComponent available={[]} svg={svg} />;
  } else {
    return <div>still loading</div>;
  }
}
