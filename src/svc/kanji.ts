import { CharacterSchema, Kanji } from "../models/kanji.schema";
import { prefixFilenameCase } from "./prefixFilename";
import { addBasePath } from "next/dist/client/add-base-path";

export async function getAllCharacters(
  wordOrPhrase: string
): Promise<{ characters: Kanji[]; fail: any }> {
  // Break into individual characters
  const chars = wordOrPhrase
    .split("")
    // Remove spaces
    .filter((a) => a.trim().length);

  // Only unique
  const uniq = [...new Set(chars)];

  const p = await Promise.allSettled(uniq.map(getKanji));
  return {
    characters: p.filter((s) => s.status === "fulfilled").map((s) => s.value),
    fail: p.filter((s) => s.status === "rejected"),
  };
}

export function getKanji(ch: string): Promise<Kanji> {
  const c = prefixFilenameCase(ch);

  return fetch(addBasePath(`/svg/${c}.json`))
    .then(handleResponse)
    .then(CharacterSchema.parse)
    .then((svg) => {
      // sanity check
      if (svg.name !== ch) {
        throw new Error(
          `SVG name: '${svg.name}' is different from character: '${ch}'`
        );
      }
      return {
        name: ch,
        svg,
      };
    });
}

function handleResponse(response: Response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }

  return response.text().then((text) => {
    const data = text && JSON.parse(text);

    if (!response.ok) {
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
